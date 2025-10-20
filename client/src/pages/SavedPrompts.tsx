import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Copy, Eye, Trash2, Video, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SavedPrompts() {
  const utils = trpc.useUtils();
  const { data: prompts, isLoading } = trpc.prompts.list.useQuery();
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [viewType, setViewType] = useState<"youtube" | "tiktok" | null>(null);

  const deletePrompt = trpc.prompts.delete.useMutation({
    onSuccess: () => {
      toast.success("Prompt deleted successfully!");
      utils.prompts.list.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete prompt: " + error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt.mutate({ id });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} prompt copied to clipboard!`);
  };

  const openPromptDialog = (prompt: any, type: "youtube" | "tiktok") => {
    setSelectedPrompt(prompt);
    setViewType(type);
  };

  const closeDialog = () => {
    setSelectedPrompt(null);
    setViewType(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your prompts...</p>
        </CardContent>
      </Card>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
          <p className="text-muted-foreground">Generate and save your first prompt to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{prompt.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {prompt.category && <span className="mr-2">📁 {prompt.category}</span>}
                    <span className="text-xs">
                      Created {new Date(prompt.createdAt!).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(prompt.id)}
                  disabled={deletePrompt.isPending}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {/* YouTube Prompt Card */}
                <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Youtube className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-primary">YouTube (Netflix-Style)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {prompt.youtubePrompt}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPromptDialog(prompt, "youtube")}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(prompt.youtubePrompt, "YouTube")}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* TikTok Prompt Card */}
                <div className="border rounded-lg p-4 bg-accent/5 border-accent/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold text-accent">TikTok / Shorts</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {prompt.tiktokPrompt}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPromptDialog(prompt, "tiktok")}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(prompt.tiktokPrompt, "TikTok")}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Prompt Dialog */}
      <Dialog open={!!selectedPrompt && !!viewType} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewType === "youtube" ? (
                <>
                  <Youtube className="w-5 h-5 text-primary" />
                  YouTube (Netflix-Style) Prompt
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 text-accent" />
                  TikTok / Shorts Prompt
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedPrompt?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={viewType === "youtube" ? selectedPrompt?.youtubePrompt : selectedPrompt?.tiktokPrompt}
              readOnly
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  copyToClipboard(
                    viewType === "youtube" ? selectedPrompt?.youtubePrompt : selectedPrompt?.tiktokPrompt,
                    viewType === "youtube" ? "YouTube" : "TikTok"
                  )
                }
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

