import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../lib/AudioContext';
import { WaveLine } from './Equalizer';

// Quick formatting of time
function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function StickyPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    volume,
    togglePlay, 
    playNext, 
    playPrev, 
    seek, 
    setVolume,
    closePlayer 
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed bottom-0 inset-x-0 z-50 p-4"
      >
        <div className="max-w-5xl mx-auto glass-strong rounded-2xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 w-full min-w-0">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 relative overflow-hidden">
                {isPlaying && (
                  <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                )}
                <span className="text-primary font-display font-bold text-xs z-10">
                  {(currentTrack.index || 0) + 1}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.2em] text-primary font-semibold">NOW PLAYING</div>
                <div className="font-display font-bold text-sm truncate">{currentTrack.title}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center flex-[2] w-full max-w-md">
              <div className="flex items-center gap-6">
                <button onClick={playPrev} className="text-muted-foreground hover:text-primary transition" aria-label="Previous">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button 
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition glow-red"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-[1px]"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button onClick={playNext} className="text-muted-foreground hover:text-primary transition" aria-label="Next">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 6h2v12h-2zm-10 6l8.5-6v12z"/></svg>
                </button>
              </div>
              
              <div className="flex items-center gap-3 w-full mt-2 text-xs font-mono text-muted-foreground">
                <span>{formatTime(progress)}</span>
                <div className="relative flex-1 h-1.5 rounded-full bg-border cursor-pointer overflow-hidden group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    seek(percent * duration);
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-primary/40 group-hover:bg-primary/60 transition-colors"
                  />
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-primary rounded-full transition-all duration-150"
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Side: Volume & Wave & Close */}
            <div className="flex items-center gap-4 flex-1 justify-end w-full">
              <div className="hidden md:block w-24">
                {isPlaying ? <WaveLine className="w-full h-8" /> : null}
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-primary cursor-pointer h-1 bg-border rounded-lg appearance-none"
                  style={{ background: `linear-gradient(to right, var(--primary) ${volume * 100}%, var(--border) ${volume * 100}%)` }}
                />
              </div>

              <button onClick={closePlayer} className="p-2 text-muted-foreground hover:text-primary transition shrink-0" aria-label="Close Player">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
