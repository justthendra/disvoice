'use client';

import { ArrowRight, Check, CheckCircle2, Copy, Terminal, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

function CodeBlock({ code, language = 'bash' }: { code: string, language?: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-white/5 bg-[#1e1f22]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2b2d31]/50 border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80"></div>
                </div>
                <button
                    onClick={copy}
                    className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

function Step({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
    return (
        <div className="relative pl-12 pb-12 border-l border-white/10 last:border-0 last:pb-0">
            <div className="absolute left-[-1.25rem] top-0 flex items-center justify-center w-10 h-10 rounded-xl bg-[#2b2d31] border border-white/10 text-blurple font-bold shadow-xl shadow-black/20">
                {number}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <div className="text-gray-400">
                {children}
            </div>
        </div>
    )
}

export default function GettingStartedPage() {
    return (
        <div className="animate-in fade-in duration-500 pb-20 max-w-4xl">
            {/* Header */}
            <div className="mb-16">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <a href="/docs" className="hover:text-white transition-colors">Docs</a>
                    <span>/</span>
                    <span className="text-blurple">Guide</span>
                </div>
                <h1 className="text-5xl font-black text-white mb-6">Getting Started</h1>
                <p className="text-xl text-gray-400 leading-relaxed">
                    Follow this guide to get Disvoice running in your project.
                    You'll have a high-quality music bot running in less than 5 minutes.
                </p>
            </div>

            {/* Prerequisites Card */}
            <div className="p-6 mb-16 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blurple/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blurple" />
                    Prerequisites
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">Node.js 16.9.0 or higher</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">ffmpeg-static</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">@discordjs/voice</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">libsodium-wrappers</span>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="mt-8">
                <Step number="01" title="Installation">
                    <p className="mb-4">Install <code className="text-blurple bg-blurple/10 px-1.5 py-0.5 rounded">disvoice</code> and the required peer dependencies.</p>
                    <CodeBlock code="npm install disvoice ffmpeg-static @discordjs/voice libsodium-wrappers" />
                </Step>

                <Step number="02" title="Client Setup">
                    <p className="mb-4">Initialize the Disvoice player with your Discord client. Make sure to include the necessary Gateway Intents.</p>
                    <CodeBlock language="javascript" code={`const { Client, GatewayIntentBits } = require('discord.js');
const { Disvoice } = require('disvoice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates, // Required for voice
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Create the player instance
const player = new Disvoice(client);`} />
                </Step>

                <Step number="03" title="Play Music">
                    <p className="mb-4">Use the <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">play()</code> method to join a voice channel and start streaming.</p>
                    <CodeBlock language="javascript" code={`client.on('messageCreate', async message => {
    if (message.content.startsWith('!play')) {
        const voiceChannel = message.member.voice.channel;
        const query = message.content.slice(6).trim();

        if (!voiceChannel) return message.reply('Join a channel first!');

        // Simple play command
        await player.play(voiceChannel, query, {
            textChannel: message.channel,
            member: message.member
        });
    }
});`} />
                </Step>

                <Step number="04" title="Handle Events">
                    <p className="mb-4">Listen to events to keep your users updated on playback status.</p>
                    <CodeBlock language="javascript" code={`player.on('playSong', (queue, song) => {
    queue.textChannel.send(\`🎶 Playing **\${song.name}**\`);
});

player.on('addSong', (queue, song) => {
    queue.textChannel.send(\`✅ Added **\${song.name}** to queue\`);
});`} />
                </Step>
            </div>

            {/* Whats Next */}
            <div className="mt-20 pt-10 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    <a href="/docs/classes" className="group p-6 rounded-2xl bg-[#1e1f22] border border-white/5 hover:border-blurple/50 hover:bg-[#2b2d31] transition-all">
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blurple transition-colors">Explore the API</h4>
                        <p className="text-sm text-gray-400">Dive deep into Classes, Methods, and Types.</p>
                    </a>
                    <a href="https://github.com/justthendra/disvoice/tree/master/examples" target="_blank" className="group p-6 rounded-2xl bg-[#1e1f22] border border-white/5 hover:border-blurple/50 hover:bg-[#2b2d31] transition-all">
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blurple transition-colors">View Examples</h4>
                        <p className="text-sm text-gray-400">See real-world usage in the examples directory.</p>
                    </a>
                </div>
            </div>

        </div>
    );
}
