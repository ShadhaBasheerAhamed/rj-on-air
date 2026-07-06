import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type Track = {
  title: string;
  desc: string;
  durationStr: string; // The formatted duration string like "2:14"
  audioSrc: string;
  tint: string;
  index: number;
};

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playTrack: (track: Track, allTracks?: Track[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  playNext: () => void;
  playPrev: () => void;
  closePlayer: () => void;
  isLoading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.pause();
      audio.src = "";
    };
  }, []); // Only run once on mount

  // Auto-play next logic requires refs or careful dependency management
  // to avoid stale closures, so we use a ref for the latest playNext function or useCallback with playlist
  
  const playNextRef = useRef<() => void>();
  
  const playNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.audioSrc === currentTrack.audioSrc);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex], playlist);
  }, [currentTrack, playlist]);

  playNextRef.current = playNext;

  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (playNextRef.current) {
        playNextRef.current();
      }
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playPrev = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.audioSrc === currentTrack.audioSrc);
    if (currentIndex === -1) return;
    
    // If progress > 3 seconds, just restart track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex], playlist);
  }, [currentTrack, playlist]);

  const playTrack = (track: Track, newPlaylist?: Track[]) => {
    if (newPlaylist) setPlaylist(newPlaylist);
    
    if (currentTrack?.audioSrc === track.audioSrc) {
      // Same track, just toggle
      togglePlay();
      return;
    }
    
    setIsLoading(true);
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        setIsLoading(false);
      });
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      duration,
      volume,
      playTrack,
      togglePlay,
      seek,
      setVolume,
      playNext,
      playPrev,
      closePlayer,
      isLoading
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
