import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Film, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function VideoGenerator() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [vibe, setVibe] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "instagram" | "tiktok">("youtube");
  const [videoUrl, setVideoUrl] = useState("");

  const generateVideo = trpc.video.generate.useMutation({
    onSuccess: (data) => {
      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        toast.success("Video generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate video");
      }
    },
    onError: (error) => {
      toast.error("Failed to generate video: " + error.message);
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (!script.trim()) {
      toast.error("Please enter a script");
      return;
    }
    if (!targetAudience.trim()) {
      toast.error("Please enter target audience");
      return;
    }

    generateVideo.mutate({
      script,
      topic,
      vibe,
      targetAudience,
      platform,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            AI Video Generator
          </CardTitle>
          <CardDescription>
            Generate actual videos using AI from your script and prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-topic">Topic / Title *</Label>
            <Input
              id="video-topic"
              placeholder="e.g., The Future of AI Technology"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="script">Video Script *</Label>
            <Textarea
              id="script"
              placeholder="Enter your video script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Tip: You can paste the generated prompts from the Generate tab as your script
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience *</Label>
              <Input
                id="target-audience"
                placeholder="e.g., Tech enthusiasts, Business professionals"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vibe">Vibe / Tone</Label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger id="vibe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="entertaining">Entertaining</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateVideo.isPending}
            className="w-full"
            size="lg"
          >
            {generateVideo.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Video... (This may take a few minutes)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Video Result */}
      {videoUrl && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Your Generated Video</CardTitle>
            <CardDescription>Video generated successfully!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <video src={videoUrl} controls className="w-full h-full">
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  Open Video
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(videoUrl);
                  toast.success("Video URL copied to clipboard!");
                }}
                className="flex-1"
              >
                Copy URL
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

