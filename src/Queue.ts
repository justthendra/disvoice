import { Track, QueueOptions } from './types';

export class Queue {
  private tracks: Track[] = [];
  private history: Track[] = [];
  private currentIndex: number = -1;
  private options: QueueOptions;

  constructor(options: QueueOptions = {}) {
    this.options = {
      loop: false,
      loopQueue: false,
      shuffle: false,
      autoplay: false,
      ...options
    };
  }

  /**
   * Add a track to the queue
   */
  add(track: Track): void {
    this.tracks.push(track);
  }

  /**
   * Add multiple tracks to the queue
   */
  addMany(tracks: Track[]): void {
    this.tracks.push(...tracks);
  }

  /**
   * Get the next track in the queue
   */
  next(): Track | null {
    if (this.options.loop && this.currentIndex >= 0) {
      return this.tracks[this.currentIndex];
    }

    if (this.options.shuffle && this.tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.tracks.length);
      const track = this.tracks[randomIndex];
      this.currentIndex = randomIndex;
      return track;
    }

    this.currentIndex++;

    if (this.currentIndex >= this.tracks.length) {
      if (this.options.loopQueue && this.tracks.length > 0) {
        this.currentIndex = 0;
        return this.tracks[0];
      }
      return null;
    }

    return this.tracks[this.currentIndex];
  }

  /**
   * Get the current track
   */
  current(): Track | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.tracks.length) {
      return null;
    }
    return this.tracks[this.currentIndex];
  }

  /**
   * Skip the current track
   */
  skip(): Track | null {
    const currentTrack = this.current();
    if (currentTrack) {
      this.history.push(currentTrack);
    }
    
    if (!this.options.loop) {
      this.remove(this.currentIndex);
      this.currentIndex--;
    }
    
    return this.next();
  }

  /**
   * Clear the entire queue
   */
  clear(): void {
    this.tracks = [];
    this.currentIndex = -1;
  }

  /**
   * Remove a track at a specific index
   */
  remove(index: number): Track | null {
    if (index < 0 || index >= this.tracks.length) {
      return null;
    }
    const removed = this.tracks.splice(index, 1)[0];
    if (index < this.currentIndex) {
      this.currentIndex--;
    }
    return removed;
  }

  /**
   * Shuffle the queue
   */
  shuffle(): void {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
    this.currentIndex = -1;
  }

  /**
   * Get all tracks in the queue
   */
  getTracks(): Track[] {
    return [...this.tracks];
  }

  /**
   * Get the queue size
   */
  size(): number {
    return this.tracks.length;
  }

  /**
   * Check if the queue is empty
   */
  isEmpty(): boolean {
    return this.tracks.length === 0;
  }

  /**
   * Get queue history
   */
  getHistory(): Track[] {
    return [...this.history];
  }

  /**
   * Set queue options
   */
  setOptions(options: QueueOptions): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get queue options
   */
  getOptions(): QueueOptions {
    return { ...this.options };
  }

  /**
   * Reset the queue position
   */
  reset(): void {
    this.currentIndex = -1;
  }
}
