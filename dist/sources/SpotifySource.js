"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifySource = void 0;
// @ts-nocheck
const BaseSource_1 = require("./BaseSource");
const types_1 = require("../types");
const spotify_url_info_1 = __importDefault(require("spotify-url-info"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Initialize spotify-url-info with global fetch
const { getData, getTracks } = (0, spotify_url_info_1.default)(fetch);
class SpotifySource extends BaseSource_1.BaseSource {
    constructor() {
        super(...arguments);
        this.name = 'Spotify';
    }
    validate(query) {
        if (!this.isURL(query))
            return false;
        return /^(https?:\/\/)?(open\.)?spotify\.com\/(track|album|playlist)\/.+$/.test(query);
    }
    async search(query, requester) {
        try {
            if (!this.validate(query)) {
                return { tracks: [] };
            }
            // First try to get basic data
            const data = await getData(query);
            // Single track
            if (data.type === 'track') {
                const track = await this.spotifyToYouTube(data, requester);
                return { tracks: track ? [track] : [] };
            }
            // Playlist or Album
            if (data.type === 'playlist' || data.type === 'album') {
                // Use getTracks for lists as it handles pagination better
                const spotifyTracks = await getTracks(query);
                const tracks = [];
                // Limit to 50 tracks to ensure performance
                const limitedTracks = spotifyTracks.slice(0, 50);
                for (const item of limitedTracks) {
                    const searchQuery = `${item.name} ${item.artists?.[0]?.name || ''}`;
                    const track = await this.searchYouTube(searchQuery, requester, item);
                    if (track)
                        tracks.push(track);
                }
                return {
                    tracks,
                    playlist: {
                        name: data.name || 'Spotify Playlist',
                        url: query,
                        tracks
                    }
                };
            }
            return { tracks: [] };
        }
        catch (error) {
            console.error('Spotify search error:', error);
            return { tracks: [] };
        }
    }
    async spotifyToYouTube(spotifyData, requester) {
        const artistName = spotifyData.artists?.[0]?.name || '';
        const searchQuery = `${spotifyData.name} ${artistName}`;
        return this.searchYouTube(searchQuery, requester, spotifyData);
    }
    async searchYouTube(query, requester, spotifyData) {
        try {
            // Use yt-dlp directly for search - much more reliable than play-dl
            // ytsearch1: returns the first result
            const safeQuery = query.replace(/"/g, ''); // Remove quotes to prevent command injection issues
            const { stdout } = await execAsync(`yt-dlp --dump-json --flat-playlist --no-playlist --no-warnings "ytsearch1:${safeQuery}"`);
            const lines = stdout.trim().split('\n').filter(Boolean);
            if (lines.length === 0)
                return null;
            const video = JSON.parse(lines[0]);
            const videoUrl = video.webpage_url || `https://www.youtube.com/watch?v=${video.id}`;
            // Prefer Spotify metadata but fall back to YouTube metadata
            return {
                title: spotifyData.name || video.title,
                url: videoUrl,
                duration: spotifyData.duration_ms ? Math.floor(spotifyData.duration_ms / 1000) : (video.duration || 0),
                thumbnail: spotifyData.coverArt?.sources?.[0]?.url || spotifyData.album?.images?.[0]?.url || video.thumbnail,
                requester,
                source: types_1.SourceType.Spotify,
                author: spotifyData.artists?.map((a) => a.name).join(', ') || video.uploader
            };
        }
        catch (error) {
            console.error(`YouTube search error for query "${query}":`, error.message);
            return null;
        }
    }
    async getStream(track) {
        return new Promise((resolve, reject) => {
            // Use yt-dlp to stream directly
            const ytdlp = (0, child_process_1.spawn)('yt-dlp', [
                '-f', 'bestaudio',
                '-o', '-',
                '--no-playlist',
                '--quiet',
                '--no-warnings',
                '--extractor-args', 'youtube:player_client=android_vr', // Use android_vr client to avoid PO Token issues
                track.url
            ]);
            ytdlp.on('error', (error) => {
                console.error('yt-dlp spawn error:', error);
                reject(new Error('Failed to spawn yt-dlp'));
            });
            // Wait for the stream to be readable
            ytdlp.stdout.once('readable', () => {
                resolve(ytdlp.stdout);
            });
            ytdlp.on('close', (code) => {
                if (code !== 0 && code !== null) {
                    // It might have closed after finishing stream, so only log if it was an error exit
                    // console.error(`yt-dlp exited with code ${code}`);
                }
            });
        });
    }
}
exports.SpotifySource = SpotifySource;
//# sourceMappingURL=SpotifySource.js.map