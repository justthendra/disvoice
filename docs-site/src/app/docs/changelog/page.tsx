'use client';

import { Calendar, GitCommit, Tag } from 'lucide-react';

interface ChangeItem {
    type: 'added' | 'fixed' | 'changed' | 'removed';
    description: string;
}

interface Release {
    version: string;
    date: string;
    description: string;
    isStable?: boolean;
    changes: ChangeItem[];
}

const RELEASES: Release[] = [
    {
        version: "1.0.0",
        date: "February 5",
        description: "The first stable release of Disvoice! Huge stability improvements and full feature parity with major music libraries.",
        isStable: true,
        changes: [
            { type: 'added', description: 'Initial stable release' },
            { type: 'added', description: 'Support for YouTube, Spotify, and SoundCloud extraction' },
            { type: 'added', description: 'Built-in audio filters (Bassboost, Nightcore, 8D)' },
            { type: 'added', description: 'Comprehensive event system' },
            { type: 'changed', description: 'Refactored internal queuing logic for 0ms latency track switching' },
            { type: 'fixed', description: 'Fixed rare packet loss issue on high-load shards' }
        ]
    },
    {
        version: "0.2.0-beta",
        date: "January 20, 2025",
        description: "Public beta release. Testing extraction logic.",
        changes: [
            { type: 'added', description: 'Basic SoundCloud support' },
            { type: 'changed', description: 'Improved error handling for restricted videos' },
            { type: 'fixed', description: 'Memory leak in FFmpeg process' }
        ]
    },
    {
        version: "0.1.0-alpha",
        date: "January 1, 2025",
        description: "Initial proof of concept.",
        changes: [
            { type: 'added', description: 'Basic local file playback' },
            { type: 'added', description: 'Simple queue system' }
        ]
    }
];

function Badge({ type }: { type: ChangeItem['type'] }) {
    const styles = {
        added: 'text-green-400 bg-green-400/10 border-green-400/20',
        fixed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        changed: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        removed: 'text-red-400 bg-red-400/10 border-red-400/20',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[type]}`}>
            {type}
        </span>
    );
}

export default function ChangelogPage() {
    return (
        <div className="animate-in fade-in duration-500 pb-20 max-w-4xl">
            <div className="mb-16">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <a href="/docs" className="hover:text-white transition-colors">Docs</a>
                    <span>/</span>
                    <span className="text-blurple">Changelog</span>
                </div>
                <h1 className="text-5xl font-black text-white mb-6">Changelog</h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                    Stay up to date with the latest changes, improvements, and fixes in Disvoice.
                </p>
            </div>

            <div className="relative border-l border-white/10 ml-4 md:ml-10 space-y-16">
                {RELEASES.map((release, i) => (
                    <div key={release.version} className="relative pl-8 md:pl-12">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-[#0f1012] ${release.isStable ? 'bg-blurple shadow-[0_0_10px_2px_rgba(88,101,242,0.5)]' : 'bg-gray-600'}`}></div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <span className={`font-mono ${release.isStable ? 'text-white' : 'text-gray-400'}`}>{release.version}</span>
                                {release.isStable && <span className="px-2 py-1 rounded-md bg-blurple/10 text-blurple text-xs font-bold border border-blurple/20">LATEST</span>}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-white/5 px-2 py-1 rounded-lg w-fit">
                                <Calendar className="w-3.5 h-3.5" />
                                {release.date}
                            </div>
                        </div>

                        <p className="text-gray-400 mb-8 leading-relaxed">
                            {release.description}
                        </p>

                        <ul className="space-y-3">
                            {release.changes.map((change, idx) => (
                                <li key={idx} className="flex items-start gap-4 group">
                                    <div className="mt-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <Badge type={change.type} />
                                    </div>
                                    <span className="text-gray-300 leading-relaxed border-b border-transparent group-hover:border-gray-700 transition-colors">
                                        {change.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
