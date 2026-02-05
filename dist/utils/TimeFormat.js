"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = formatDuration;
exports.parseDuration = parseDuration;
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
function parseDuration(duration) {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    else if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
    }
    else {
        // SS
        return parts[0];
    }
}
//# sourceMappingURL=TimeFormat.js.map