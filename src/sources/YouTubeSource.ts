// @ts-nocheck
import { BaseSource } from "./BaseSource";
import { Track, SearchResult, SourceType } from "../types";
import { User } from "discord.js";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import { Readable } from "stream";

const execAsync = promisify(exec);

export class YouTubeSource extends BaseSource {
  name = "YouTube";

  validate(query: string): boolean {
    if (!this.isURL(query)) return false;

    const urlPatterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=.+$/,
    ];

    return urlPatterns.some((pattern) => pattern.test(query));
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  async search(query: string, requester: User): Promise<SearchResult> {
    try {
      // If it's a URL, get info directly
      if (this.validate(query)) {
        const videoId = this.extractVideoId(query);

        if (videoId) {
          try {
            const info = await this.getVideoInfo(
              `https://www.youtube.com/watch?v=${videoId}`,
            );
            if (info) {
              const track: Track = {
                title: info.title || "Unknown",
                url: `https://www.youtube.com/watch?v=${videoId}`,
                duration: info.duration || 0,
                thumbnail: info.thumbnail,
                requester,
                source: SourceType.YouTube,
                author: info.channel || "Unknown",
              };
              return { tracks: [track] };
            }
          } catch (e) {
            console.error("Error getting video info:", e);
          }
        }
      }

      // Search for the query using yt-dlp
      const searchResults = await this.searchVideos(query);

      if (searchResults.length === 0) {
        return { tracks: [] };
      }

      const tracks: Track[] = searchResults.map((video) => ({
        title: video.title || "Unknown",
        url: video.url,
        duration: video.duration || 0,
        thumbnail: video.thumbnail,
        requester,
        source: SourceType.YouTube,
        author: video.channel || "Unknown",
      }));

      return { tracks };
    } catch (error) {
      console.error("YouTube search error:", error);
      return { tracks: [] };
    }
  }

  private async getVideoInfo(url: string): Promise<any> {
    try {
      const { stdout } = await execAsync(
        `yt-dlp --dump-json --no-playlist "${url}"`,
        { maxBuffer: 10 * 1024 * 1024 },
      );
      const info = JSON.parse(stdout);
      return {
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        channel: info.channel || info.uploader,
      };
    } catch (error) {
      console.error("yt-dlp info error:", error);
      return null;
    }
  }

  private async searchVideos(query: string): Promise<any[]> {
    try {
      const { stdout } = await execAsync(
        `yt-dlp --dump-json --flat-playlist --no-playlist --extractor-args "youtube:player_client=android_vr" "ytsearch5:${query}"`,
        { maxBuffer: 10 * 1024 * 1024 },
      );

      const lines = stdout.trim().split("\n").filter(Boolean);
      return lines.map((line) => {
        const info = JSON.parse(line);
        return {
          title: info.title,
          url: info.url || `https://www.youtube.com/watch?v=${info.id}`,
          duration: info.duration,
          thumbnail: info.thumbnail || info.thumbnails?.[0]?.url,
          channel: info.channel || info.uploader,
        };
      });
    } catch (error) {
      console.error("yt-dlp search error:", error);
      return [];
    }
  }
  async getStream(track: Track): Promise<NodeJS.ReadableStream> {
    if (!track.url) {
      throw new Error("Track URL is undefined");
    }

    return new Promise((resolve, reject) => {
      // Use android_vr client which doesn't require PO Token
      const ytdlp = spawn("yt-dlp", [
        "-f",
        "bestaudio",
        "-o",
        "-",
        "--no-playlist",
        "--quiet",
        "--extractor-args",
        "youtube:player_client=android_vr",
        track.url,
      ]);

      ytdlp.on("error", (error) => {
        console.error("yt-dlp spawn error:", error);
        reject(new Error("Failed to spawn yt-dlp"));
      });

      ytdlp.stderr.on("data", (data) => {
        console.error("yt-dlp stderr:", data.toString());
      });

      ytdlp.stdout.once("readable", () => {
        resolve(ytdlp.stdout);
      });

      ytdlp.on("close", (code) => {
        if (code !== 0 && code !== null) {
          console.error(`yt-dlp exited with code ${code}`);
        }
      });

      setTimeout(() => {
        if (!ytdlp.stdout.readable) {
          ytdlp.kill();
          reject(new Error("yt-dlp timed out"));
        }
      }, 30000);
    });
  }

  private parseDuration(duration: string): number {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  }
}
