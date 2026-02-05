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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = exports.formatDuration = exports.SoundCloudSource = exports.SpotifySource = exports.YouTubeSource = exports.BaseSource = exports.Queue = exports.MusicPlayer = void 0;
var MusicPlayer_1 = require("./MusicPlayer");
Object.defineProperty(exports, "MusicPlayer", { enumerable: true, get: function () { return MusicPlayer_1.MusicPlayer; } });
var Queue_1 = require("./Queue");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return Queue_1.Queue; } });
var BaseSource_1 = require("./sources/BaseSource");
Object.defineProperty(exports, "BaseSource", { enumerable: true, get: function () { return BaseSource_1.BaseSource; } });
var YouTubeSource_1 = require("./sources/YouTubeSource");
Object.defineProperty(exports, "YouTubeSource", { enumerable: true, get: function () { return YouTubeSource_1.YouTubeSource; } });
var SpotifySource_1 = require("./sources/SpotifySource");
Object.defineProperty(exports, "SpotifySource", { enumerable: true, get: function () { return SpotifySource_1.SpotifySource; } });
var SoundCloudSource_1 = require("./sources/SoundCloudSource");
Object.defineProperty(exports, "SoundCloudSource", { enumerable: true, get: function () { return SoundCloudSource_1.SoundCloudSource; } });
__exportStar(require("./types"), exports);
var TimeFormat_1 = require("./utils/TimeFormat");
Object.defineProperty(exports, "formatDuration", { enumerable: true, get: function () { return TimeFormat_1.formatDuration; } });
Object.defineProperty(exports, "parseDuration", { enumerable: true, get: function () { return TimeFormat_1.parseDuration; } });
//# sourceMappingURL=index.js.map