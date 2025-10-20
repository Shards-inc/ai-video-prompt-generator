import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Copy, Download, Save, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PromptGenerator() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("8-12");
  const [tone, setTone] = useState("cinematic");
  const [youtubePrompt, setYoutubePrompt] = useState("");
  const [tiktokPrompt, setTiktokPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const savePrompt = trpc.prompts.create.useMutation({
    onSuccess: () => {
      toast.success("Prompt saved successfully!");
      utils.prompts.list.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to save prompt: " + error.message);
    },
  });

  const generatePrompts = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);

    // Generate YouTube (Netflix-style) prompt
    const youtubeGenerated = `🎬 Netflix-Style YouTube Video Prompt

Title: ${topic}
${category ? `Category: ${category}` : ""}

Objective: Create a cinematic, professional documentary-style video about ${topic}.

Length: ${length} minutes (episodic/mini-documentary style)

Tone & Style: High-budget Netflix documentary or series intro. Clean cinematography, moody lighting, depth of field, smooth camera pans, professional colour grading with ${tone} aesthetic.

Structure:
• Opening Hook (0:00–0:30): Cinematic cold-open with suspense or intrigue about ${topic}
• Act 1 (0:30–3:00): Establish theme with strong visuals and voiceover narration
• Act 2 (3:00–8:00): Story progression with character development and dramatic beats
• Finale (8:00–${length}:00): Resolution or cliffhanger ending with cinematic outro music

Visual Direction:
• Use dramatic lighting with high contrast and depth of field
• Smooth, professional camera movements (pans, dollies, crane shots)
• Cinematic color grading with rich, saturated tones
• Establish wide shots followed by intimate close-ups
• Include atmospheric B-roll footage

Audio:
• Netflix-style orchestral score (ambient, emotional, building tension)
• Professional voiceover narration with clear, authoritative tone
• Subtle sound design and ambient audio layers

Format: 16:9 horizontal, 4K resolution, 24fps for cinematic feel

Create a visually stunning, emotionally engaging documentary about ${topic} that feels like a premium Netflix production.`;

    // Generate TikTok/Shorts prompt
    const tiktokGenerated = `📱 TikTok/YouTube Shorts Prompt

Title: ${topic}
${category ? `Category: ${category}` : ""}

Objective: Create a fast-paced, viral-worthy short video about ${topic}.

Length: 30-45 seconds

Tone & Style: Fast cuts, trending TikTok transitions, high-energy captions, bold text overlays, punchy visuals.

Structure:
• Hook (0-3s): Bold text on screen + catchy sound effect - grab attention immediately about ${topic}
• Main Point (3-25s): Quick storytelling with fast zooms, dynamic transitions, and meme-style cuts
• CTA (25-45s): End with cliffhanger, question, or direct engagement ("Follow for part 2!")

Visual Direction:
• Vertical 9:16 format optimized for mobile viewing
• Fast-paced editing with cuts every 2-3 seconds
• Bold, colorful text overlays with trending fonts
• High-contrast, saturated colors for maximum impact
• Dynamic camera movements (whip pans, zooms, rotations)
• Trending transition effects (swipe, zoom, morph)

Text & Captions:
• Large, bold on-screen text for key points
• Emoji usage for emphasis and engagement 🔥✨
• Captions that appear word-by-word for rhythm
• Hook text in first 1 second

Audio:
• Trending TikTok audio or upbeat background music
• Punchy sound effects for transitions
• Fast-paced, energetic soundtrack

Engagement Elements:
• End with a question to drive comments
• Include a call-to-action (like, follow, share)
• Create curiosity for follow-up content

Format: 9:16 vertical, 1080x1920, 30fps

Create an attention-grabbing, scroll-stopping video about ${topic} optimized for maximum engagement and virality on TikTok and YouTube Shorts.`;

    setYoutubePrompt(youtubeGenerated);
    setTiktokPrompt(tiktokGenerated);
    setIsGenerating(false);
    toast.success("Prompts generated successfully!");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} prompt copied to clipboard!`);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save prompts");
      return;
    }

    if (!youtubePrompt || !tiktokPrompt) {
      toast.error("Please generate prompts first");
      return;
    }

    savePrompt.mutate({
      title: topic,
      topic,
      category,
      youtubePrompt,
      tiktokPrompt,
      customizations: JSON.stringify({ length, tone }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Video Prompts
          </CardTitle>
          <CardDescription>
            Enter your topic and customize the settings to generate professional AI video prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Title *</Label>
              <Input
                id="topic"
                placeholder="e.g., The Future of AI Technology"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Technology, Education, Entertainment"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">YouTube Video Length (minutes)</Label>
              <Input
                id="length"
                placeholder="e.g., 8-12"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Visual Tone</Label>
              <Input
                id="tone"
                placeholder="e.g., cinematic, dramatic, uplifting"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={generatePrompts} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Prompts
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Prompts */}
      {(youtubePrompt || tiktokPrompt) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* YouTube Prompt */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">YouTube (Netflix-Style)</CardTitle>
              <CardDescription>Long-form cinematic video prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={youtubePrompt}
                onChange={(e) => setYoutubePrompt(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(youtubePrompt, "YouTube")}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TikTok Prompt */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">TikTok / Shorts</CardTitle>
              <CardDescription>Short-form viral video prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={tiktokPrompt}
                onChange={(e) => setTiktokPrompt(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(tiktokPrompt, "TikTok")}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      {(youtubePrompt || tiktokPrompt) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Save Your Prompts</h4>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated
                    ? "Save these prompts to access them later"
                    : "Sign in to save and manage your prompts"}
                </p>
              </div>
              <Button onClick={handleSave} disabled={!isAuthenticated || savePrompt.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {savePrompt.isPending ? "Saving..." : "Save Prompts"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

