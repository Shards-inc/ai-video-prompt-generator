import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Film, Sparkles, Video, Youtube } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import PromptGenerator from "./PromptGenerator";
import SavedPrompts from "./SavedPrompts";
import VideoGenerator from "./VideoGenerator";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("generate");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {APP_TITLE}
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Video Prompt Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user?.name || user?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Professional AI Video Prompts
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create Stunning Video Prompts for{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                YouTube & TikTok
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate professional, AI-optimized prompts for Netflix-style YouTube videos and viral TikTok content.
              Perfect for creators using Sora, Runway, InVideo, and other AI video generators.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="generate" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Prompts
                </TabsTrigger>
                <TabsTrigger value="video" className="gap-2" disabled={!isAuthenticated}>
                  <Film className="w-4 h-4" />
                  Generate Video
                </TabsTrigger>
                <TabsTrigger value="saved" className="gap-2" disabled={!isAuthenticated}>
                  <Video className="w-4 h-4" />
                  My Prompts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                <PromptGenerator />
              </TabsContent>

              <TabsContent value="video">
                {isAuthenticated ? (
                  <VideoGenerator />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">Sign in to generate videos</p>
                      <Button asChild>
                        <a href={getLoginUrl()}>Sign In</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="saved">
                {isAuthenticated ? (
                  <SavedPrompts />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">Sign in to save and manage your prompts</p>
                      <Button asChild>
                        <a href={getLoginUrl()}>Sign In</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Why Use Our Generator?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Youtube className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Netflix-Style YouTube</CardTitle>
                  <CardDescription>
                    Create cinematic, professional prompts for long-form content with dramatic storytelling and
                    high-budget aesthetics.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Viral TikTok Shorts</CardTitle>
                  <CardDescription>
                    Generate fast-paced, engaging prompts optimized for vertical video with trending elements and
                    attention-grabbing hooks.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>AI-Optimized</CardTitle>
                  <CardDescription>
                    Prompts designed specifically for AI video generators like Sora, Runway, InVideo, and more. Get
                    better results with less trial and error.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card/30 backdrop-blur-sm">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 {APP_TITLE}. Powered by AI for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

