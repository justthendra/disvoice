import { Track, QueueOptions } from './types';
export declare class Queue {
    private tracks;
    private history;
    private currentIndex;
    private options;
    constructor(options?: QueueOptions);
    /**
     * Add a track to the queue
     */
    add(track: Track): void;
    /**
     * Add multiple tracks to the queue
     */
    addMany(tracks: Track[]): void;
    /**
     * Get the next track in the queue
     */
    next(): Track | null;
    /**
     * Get the current track
     */
    current(): Track | null;
    /**
     * Skip the current track
     */
    skip(): Track | null;
    /**
     * Clear the entire queue
     */
    clear(): void;
    /**
     * Remove a track at a specific index
     */
    remove(index: number): Track | null;
    /**
     * Shuffle the queue
     */
    shuffle(): void;
    /**
     * Get all tracks in the queue
     */
    getTracks(): Track[];
    /**
     * Get the queue size
     */
    size(): number;
    /**
     * Check if the queue is empty
     */
    isEmpty(): boolean;
    /**
     * Get queue history
     */
    getHistory(): Track[];
    /**
     * Set queue options
     */
    setOptions(options: QueueOptions): void;
    /**
     * Get queue options
     */
    getOptions(): QueueOptions;
    /**
     * Reset the queue position
     */
    reset(): void;
}
//# sourceMappingURL=Queue.d.ts.map