import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface GenerateVideoParams {
  script: string;
  topic: string;
  vibe: string;
  targetAudience: string;
  platform: "youtube" | "instagram" | "tiktok";
}

export interface GenerateVideoResult {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

/**
 * Generate a video using InVideo MCP server
 */
export async function generateVideo(params: GenerateVideoParams): Promise<GenerateVideoResult> {
  try {
    const input = JSON.stringify({
      script: params.script,
      topic: params.topic,
      vibe: params.vibe,
      targetAudience: params.targetAudience,
      platform: params.platform,
    });

    const command = `manus-mcp-cli tool call generate-video-from-script --server invideo --input '${input.replace(/'/g, "'\\''")}'`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stderr) {
      console.error("InVideo stderr:", stderr);
    }

    // Parse the output to extract video URL
    const output = stdout.trim();
    console.log("InVideo output:", output);

    // The MCP tool should return a video URL
    // Parse the JSON response
    try {
      const result = JSON.parse(output);
      if (result.content && result.content[0] && result.content[0].text) {
        const videoUrl = result.content[0].text;
        return {
          success: true,
          videoUrl,
        };
      }
    } catch (parseError) {
      console.error("Failed to parse InVideo response:", parseError);
    }

    return {
      success: false,
      error: "Failed to parse video generation response",
    };
  } catch (error) {
    console.error("InVideo generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

