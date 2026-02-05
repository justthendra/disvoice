"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCloudSource = void 0;
// @ts-nocheck
const BaseSource_1 = require("./BaseSource");
const types_1 = require("../types");
const playdl = __importStar(require("play-dl"));
class SoundCloudSource extends BaseSource_1.BaseSource {
    constructor() {
        super(...arguments);
        this.name = 'SoundCloud';
    }
    validate(query) {
        if (!this.isURL(query))
            return false;
        return /^(https?:\/\/)?(www\.)?(soundcloud\.com|snd\.sc)\/.+$/.test(query);
    }
    async search(query, requester) {
        try {
            if (!this.validate(query)) {
                // Search by keyword
                const searched = await playdl.search(query, { source: { soundcloud: 'tracks' }, limit: 5 });
                const tracks = searched.map((result) => ({
                    title: result.name || result.title || 'Unknown',
                    url: result.url,
                    duration: result.durationInSec || 0,
                    thumbnail: result.thumbnail?.url,
                    requester,
                    source: types_1.SourceType.SoundCloud,
                    author: result.user?.name || result.artists?.[0]?.name
                }));
                return { tracks };
            }
            // Direct URL
            const type = await playdl.validate(query);
            if (type === 'so_track') {
                const info = await playdl.soundcloud(query);
                const track = {
                    title: info.name || 'Unknown',
                    url: info.url,
                    duration: info.durationInSec || 0,
                    thumbnail: info.thumbnail?.url,
                    requester,
                    source: types_1.SourceType.SoundCloud,
                    author: info.user?.name
                };
                return { tracks: [track] };
            }
            else if (type === 'so_playlist') {
                const playlist = await playdl.soundcloud(query);
                if (!playlist.tracks || playlist.tracks.length === 0) {
                    return { tracks: [] };
                }
                const tracks = playlist.tracks.map((track) => ({
                    title: track.name || 'Unknown',
                    url: track.url,
                    duration: track.durationInSec || 0,
                    thumbnail: track.thumbnail?.url,
                    requester,
                    source: types_1.SourceType.SoundCloud,
                    author: track.user?.name
                }));
                return {
                    tracks,
                    playlist: {
                        name: playlist.name || 'Unknown Playlist',
                        url: query,
                        tracks
                    }
                };
            }
            return { tracks: [] };
        }
        catch (error) {
            console.error('SoundCloud search error:', error);
            return { tracks: [] };
        }
    }
    async getStream(track) {
        try {
            const stream = await playdl.stream(track.url);
            return stream.stream;
        }
        catch (error) {
            console.error('SoundCloud stream error:', error);
            throw new Error('Failed to get SoundCloud stream');
        }
    }
}
exports.SoundCloudSource = SoundCloudSource;
//# sourceMappingURL=SoundCloudSource.js.map