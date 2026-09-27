import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AudioPlayerProps {
  autoStart?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ autoStart = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Listen to native audio element play / pause events
    const audio = soundManager.getAudioElement();
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    if (autoStart) {
      soundManager.startMusic();
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [autoStart]);

  const togglePlayback = () => {
    const active = soundManager.toggleMusic();
    setIsPlaying(active);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* Native HTML5 Audio Element connected to together.mp3 */}
      <audio
        id="song"
        src="/audio/together.mp3"
        preload="auto"
        loop
        className="hidden"
        aria-hidden="true"
      />

      {/* Floating aesthetic music widget */}
      <aside 
        aria-label="Pemutar musik TOGETHER!"
        className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel shadow-sm border border-rose-200/80 transition-all duration-300 hover:shadow-md"
      >
        <button
          type="button"
          onClick={togglePlayback}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform active:scale-95 ${
            isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          }`}
          title={isPlaying ? 'Jeda lagu TOGETHER!' : 'Putar lagu TOGETHER!'}
          aria-label={isPlaying ? 'Jeda lagu TOGETHER!' : 'Putar lagu TOGETHER!'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Music className={`w-3.5 h-3.5 text-rose-500 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="text-xs font-semibold text-rose-900 tracking-wide select-none">
              TOGETHER! ♫
            </span>
            {isPlaying && <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />}
          </div>
          <span className="text-[10px] text-rose-400 font-serif-title italic">
            {isPlaying ? 'Sedang diputar ♡' : 'JANNABI'}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="ml-1 p-1 text-rose-400 hover:text-rose-600 transition-colors"
          title={isMuted ? 'Bunyikan suara' : 'Bisukan suara'}
          aria-label={isMuted ? 'Bunyikan suara' : 'Bisukan suara'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};
