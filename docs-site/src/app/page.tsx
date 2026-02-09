'use client';

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search } from "@/components/Search";
import { ArrowRight, Github, Music, Zap, Code, Shield, Radio, Command, Book } from "lucide-react";
import { useRef } from "react";

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-3xl bg-[#2b2d31]/40 border border-white/5 hover:border-blurple/50 backdrop-blur-sm transition-all duration-500 hover:bg-[#2b2d31]/60 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blurple/10"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-blurple to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blurple/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blurple transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-[#0f1012] text-white selection:bg-blurple selection:text-white overflow-hidden font-sans">

      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f1012]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0f1012]/60">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-tr from-blurple to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blurple/20">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Disvoice
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 font-medium text-sm">
            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors hover:bg-white/5 px-4 py-2 rounded-full flex items-center gap-2">
              <Book className="w-4 h-4" />
              Documentation
            </Link>
            <Link href="https://github.com/justthendra/disvoice" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:bg-white/5 px-4 py-2 rounded-full flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Link>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <Search />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-48 pb-32 relative" ref={containerRef}>

        {/* Animated Background Gradients context-aware light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blurple/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>

        <div className="md:flex items-center justify-between gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blurple/10 text-blurple text-xs font-bold uppercase tracking-wider mb-8 border border-blurple/20 shadow-sm shadow-blurple/10"
            >
              <Zap className="w-3 h-3 fill-blurple" />
              v1.0.0 is now live
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blurple to-indigo-400">Better Music</span> Bots
            </h1>

            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
              The advanced, type-safe music ecosystem for Discord.js.
              Stream reliable audio from your favorite platforms with developer-first ergonomics.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/docs"
                className="px-8 py-4 bg-blurple hover:bg-blurple-hover text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl shadow-blurple/30 flex items-center justify-center gap-3 group"
              >
                Read Documentation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/justthendra/disvoice"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-[#2b2d31]/50 hover:bg-[#2b2d31] text-white rounded-2xl font-bold text-lg transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Right Content - Code Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden md:block md:w-1/2 relative perspective-[2000px]"
            style={{ y }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blurple to-indigo-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-[#1e1f22] rounded-2xl border border-white/10 shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">

              {/* Window Controls */}
              <div className="flex items-center justify-between px-5 py-4 bg-[#2b2d31] border-b border-black/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono font-medium flex items-center gap-2">
                  <Command className="w-3 h-3" />
                  index.ts
                </div>
              </div>

              {/* Code */}
              <div className="p-8 font-mono text-sm leading-7 overflow-x-auto">
                <div className="text-gray-300">
                  <span className="text-purple-400">import</span> <span className="text-yellow-100">Disvoice</span> <span className="text-purple-400">from</span> <span className="text-green-400">'disvoice'</span>;<br /><br />

                  <span className="text-gray-500">// Initialize the music system</span><br />
                  <span className="text-purple-400">const</span> <span className="text-red-400">music</span> <span className="text-purple-400">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-100">Disvoice</span>(<span className="text-red-400">client</span>);<br /><br />

                  <span className="text-gray-500">// Join & Play with one line</span><br />
                  <span className="text-purple-400">await</span> <span className="text-red-400">music</span>.<span className="text-blue-400">play</span>(<br />
                  &nbsp;&nbsp;<span className="text-red-400">channel</span>,<br />
                  &nbsp;&nbsp;<span className="text-green-400">'https://youtu.be/dQw4w9WgXcQ'</span><br />
                  );<br /><br />

                  <span className="text-gray-500">// Event driven architecture</span><br />
                  <span className="text-red-400">music</span>.<span className="text-blue-400">on</span>(<span className="text-green-400">'playSong'</span>, (<span className="text-red-400">queue</span>, <span className="text-red-400">song</span>) <span className="text-purple-400">=&gt;</span> {'{'}<br />
                  &nbsp;&nbsp;<span className="text-red-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-green-400">`Playing ${'{'}song.name{'}'}`</span>);<br />
                  {'}'});
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-[#0f1012] to-[#131417]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Why choose <span className="text-blurple">Disvoice</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Engineered for stability, performance, and developer happiness.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Radio}
              title="Multi-Platform"
              description="Unified interface for YouTube, Spotify, SoundCloud and direct links. No complex plugins required."
              delay={0.1}
            />
            <FeatureCard
              icon={Code}
              title="Type-Safe"
              description="Built completely in TypeScript. Enjoy full autocomplete, strict typing and zero runtime surprises."
              delay={0.2}
            />
            <FeatureCard
              icon={Shield}
              title="Rock Solid"
              description="Leveraging the latest @discordjs/voice stability. Auto-reconnection and error handling baked in."
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="High Performance"
              description="Optimized streaming engine ensures lag-free playback even on high-load bots."
              delay={0.4}
            />
            <FeatureCard
              icon={Command}
              title="Plugin System"
              description="Extend functionality with custom extractors and filters. Built to be customized."
              delay={0.5}
            />
            <FeatureCard
              icon={Music}
              title="Audio Filters"
              description="Bassboost, nightcore, 8D and more. Real-time audio processing chain included."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0c0e] pt-24 pb-12 border-t border-white/5 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blurple/5 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2b2d31] rounded-xl flex items-center justify-center border border-white/5">
                  <Music className="w-5 h-5 text-blurple" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Disvoice
                </span>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                The ultimate audio library for Discord.js. Built for performance, stability, and developer experience.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/justthendra/disvoice" className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:bg-blurple hover:text-white transition-all duration-300">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/54gjhdEUat" className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:bg-[#5865F2] hover:text-white transition-all duration-300">
                  {/* Discord Icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-blurple transition-colors">Documentation</Link></li>
                <li><Link href="/docs/guide/getting-started" className="hover:text-blurple transition-colors">Getting Started</Link></li>
                <li><a href="https://npmjs.com/package/disvoice" className="hover:text-blurple transition-colors">NPM Package</a></li>
                <li><a href="#" className="hover:text-blurple transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Community</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="https://github.com/justthendra/disvoice" className="hover:text-blurple transition-colors">Github</a></li>
                <li><a href="https://discord.gg/54gjhdEUat" className="hover:text-blurple transition-colors">Discord Server</a></li>
                <li><a href="https://github.com/justthendra/disvoice/issues" className="hover:text-blurple transition-colors">Report Issues</a></li>
                <li><a href="https://github.com/justthendra/disvoice/pulls" className="hover:text-blurple transition-colors">Contributing</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Thendra. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
