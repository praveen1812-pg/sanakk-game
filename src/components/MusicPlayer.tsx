import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    title: "NEON_DRIFT",
    artist: "AI.Gen Module A",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#39ff14"
  },
  {
    title: "CYBER_PULSE",
    artist: "AI.Gen Module B",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff"
  },
  {
    title: "SYNTH_GRID",
    artist: "AI.Gen Module C",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ff00ff"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const track = TRACKS[currentTrack];

  return (
    <div className="h-24 bg-white/5 backdrop-blur-md border-t border-white/10 px-8 flex items-center justify-between">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      {/* Track Info */}
      <div className="flex items-center space-x-6 w-1/3">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden" style={{ borderColor: track.color }}>
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-8 h-8 rounded-full border-t-2"
              style={{ borderTopColor: track.color }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-white/20" />
          )}
        </div>
        <div>
          <div className="text-sm font-bold uppercase" style={{ color: track.color, textShadow: `0 0 8px ${track.color}80` }}>{track.title}</div>
          <div className="text-xs text-white/40 italic flex flex-col gap-1">
            <span>{track.artist}</span>
            <span className="font-mono">
              {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + ('0' + Math.floor(audioRef.current.currentTime % 60)).slice(-2) : '0:00'} / 
              {audioRef.current && !isNaN(audioRef.current.duration) ? ' ' + Math.floor(audioRef.current.duration / 60) + ':' + ('0' + Math.floor(audioRef.current.duration % 60)).slice(-2) : ' 0:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-12">
        <button onClick={prevTrack} className="opacity-50 hover:opacity-100 transition-opacity">
          <SkipBack className="w-6 h-6" />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-12 h-12 rounded-full text-black flex items-center justify-center hover:scale-105 transition-transform"
          style={{ backgroundColor: track.color, boxShadow: `0 0 20px ${track.color}66` }}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
        </button>
        <button onClick={nextTrack} className="opacity-50 hover:opacity-100 transition-opacity">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Audio Stream Visualizer & Volume */}
      <div className="w-1/3 flex justify-end items-center space-x-6">
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-white/40 uppercase tracking-widest hidden lg:block">Audio Stream</div>
          <div className="flex space-x-1 items-end h-6 opacity-80" onClick={toggleMute} style={{ cursor: 'pointer' }}>
            {(!isMuted && isPlaying) ? (
              <>
                <motion.div className="w-1 h-2" style={{ backgroundColor: track.color }} animate={{ height: ['25%', '80%', '40%'] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                <motion.div className="w-1 h-4" style={{ backgroundColor: track.color }} animate={{ height: ['60%', '30%', '90%'] }} transition={{ repeat: Infinity, duration: 0.4 }} />
                <motion.div className="w-1 h-6" style={{ backgroundColor: track.color }} animate={{ height: ['100%', '20%', '60%'] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                <motion.div className="w-1 h-3" style={{ backgroundColor: track.color }} animate={{ height: ['40%', '90%', '30%'] }} transition={{ repeat: Infinity, duration: 0.45 }} />
                <motion.div className="w-1 h-5" style={{ backgroundColor: track.color }} animate={{ height: ['80%', '40%', '100%'] }} transition={{ repeat: Infinity, duration: 0.55 }} />
              </>
            ) : (
              <>
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
