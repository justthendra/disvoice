// @ts-nocheck
import { BaseSource } from './BaseSource';
import { Track, SearchResult, SourceType } from '../types';
import { User } from 'discord.js';
import * as playdl from 'play-dl';

export class SoundCloudSource extends BaseSource {
  name = 'SoundCloud';

  validate(query: string): boolean {
    if (!this.isURL(query)) return false;
    return /^(https?:\/\/)?(www\.)?(soundcloud\.com|snd\.sc)\/.+$/.test(query);
  }

  async search(query: string, requester: User): Promise<SearchResult> {
    try {
      if (!this.validate(query)) {
        // Search by keyword
        const searched = await playdl.search(query, { source: { soundcloud: 'tracks' }, limit: 5 });
        
        const tracks: Track[] = searched.map((result: any) => ({
          title: result.name || result.title || 'Unknown',
          url: result.url,
          duration: result.durationInSec || 0,
          thumbnail: result.thumbnail?.url,
          requester,
          source: SourceType.SoundCloud,
          author: result.user?.name || result.artists?.[0]?.name
        }));

        return { tracks };
      }

      // Direct URL
      const type = await playdl.validate(query);
      
      if (type === 'so_track') {
        const info = await playdl.soundcloud(query);
        
        const track: Track = {
          title: info.name || 'Unknown',
          url: info.url,
          duration: info.durationInSec || 0,
          thumbnail: info.thumbnail?.url,
          requester,
          source: SourceType.SoundCloud,
          author: info.user?.name
        };

        return { tracks: [track] };
      } else if (type === 'so_playlist') {
        const playlist = await playdl.soundcloud(query);
        
        if (!playlist.tracks || playlist.tracks.length === 0) {
          return { tracks: [] };
        }

        const tracks: Track[] = playlist.tracks.map((track: any) => ({
          title: track.name || 'Unknown',
          url: track.url,
          duration: track.durationInSec || 0,
          thumbnail: track.thumbnail?.url,
          requester,
          source: SourceType.SoundCloud,
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
    } catch (error) {
      console.error('SoundCloud search error:', error);
      return { tracks: [] };
    }
  }

  async getStream(track: Track): Promise<string | NodeJS.ReadableStream> {
    try {
      const stream = await playdl.stream(track.url);
      return stream.stream;
    } catch (error) {
      console.error('SoundCloud stream error:', error);
      throw new Error('Failed to get SoundCloud stream');
    }
  }
}
