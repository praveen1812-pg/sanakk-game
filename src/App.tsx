import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-base font-mono text-white selection:bg-neon-green/30">
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          <h1 className="font-display font-black text-xl tracking-widest text-neon-cyan [text-shadow:0_0_10px_rgba(0,255,255,0.7)]">
            SYNTH-STRIDER
          </h1>
        </div>
        <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>System: Nominal</span>
          <span>Latency: 14ms</span>
          <span>Sync: Active</span>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 flex items-center justify-center relative bg-black pb-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <SnakeGame />
        </section>
      </main>
      
      {/* Fixed Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <MusicPlayer />
      </div>

    </div>
  );
}
