import React, { useState, useEffect } from 'react';
import { DEFAULT_CONFIG, DEFAULT_MEMORIES } from './data/defaultConfig';
import { SurpriseConfig, MemoryItem } from './types';
import { FloatingHearts } from './components/FloatingHearts';
import { AudioPlayer } from './components/AudioPlayer';
import { LockScreen } from './components/LockScreen';
import { MemoriesScreen } from './components/MemoriesScreen';
import { LetterScreen } from './components/LetterScreen';
import { FinalScreen } from './components/FinalScreen';
import { burstHearts } from './utils/confetti';
import { soundManager } from './utils/audio';

type ScreenId = 'lock' | 'memories' | 'letter' | 'final';

export default function App() {
  const [config, setConfig] = useState<SurpriseConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlGf = params.get('gf');
      const urlCode = params.get('code');
      const urlFrom = params.get('from');

      return {
        ...DEFAULT_CONFIG,
        gfName: urlGf || DEFAULT_CONFIG.gfName,
        secretCode: urlCode || DEFAULT_CONFIG.secretCode,
        finalName: urlFrom || DEFAULT_CONFIG.finalName,
      };
    }
    return DEFAULT_CONFIG;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('lock');
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('romantic_memories_photos');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return DEFAULT_MEMORIES.map((m, i) => ({
            ...m,
            image: parsed[i] || m.image,
          }));
        } catch {
          // fallback to defaults
        }
      }
    }
    return DEFAULT_MEMORIES;
  });

  // Synchronize document title with GF_NAME
  useEffect(() => {
    document.title = `Untuk ${config.gfName} ♡`;
  }, [config.gfName]);

  // Screen navigation helper function matching user's show(id)
  const show = (id: ScreenId) => {
    setCurrentScreen(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    burstHearts(8);
  };

  const handleUnlock = () => {
    soundManager.startMusic();
    show('memories');
  };

  const handleReplay = () => {
    soundManager.stopMusic();
    const audioElem = document.getElementById('song') as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.pause();
      audioElem.currentTime = 0;
    }
    show('lock');
  };

  const handleUpdateConfig = (newVals: Partial<SurpriseConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newVals,
    }));
  };

  // Direct photo updates (100% original binary data from device)
  const handleUpdateMemoryImage = (id: string, newImageUrl: string) => {
    setMemories(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, image: newImageUrl } : m));
      try {
        localStorage.setItem(
          'romantic_memories_photos',
          JSON.stringify(updated.map(m => m.image))
        );
      } catch {}
      return updated;
    });
  };

  const handleBatchUpdateImages = (newImages: string[]) => {
    setMemories(prev => {
      const updated = prev.map((m, idx) => ({
        ...m,
        image: newImages[idx] || m.image,
      }));
      try {
        localStorage.setItem(
          'romantic_memories_photos',
          JSON.stringify(updated.map(m => m.image))
        );
      } catch {}
      return updated;
    });
  };

  return (
    <div className="relative min-h-screen text-stone-800 overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      {/* Background ambient texture / floral aesthetic gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(254,205,211,0.5),rgba(255,255,255,0))]" />

      {/* Floating hearts overlay */}
      <FloatingHearts />

      {/* Audio player widget with TOGETHER! by Jannabi */}
      <AudioPlayer />

      {/* Top minimal progress breadcrumbs (visible after unlock) */}
      {currentScreen !== 'lock' && (
        <nav
          aria-label="Progres kejutan"
          className="relative z-30 pt-4 pb-2 px-4 flex items-center justify-center gap-2 max-w-sm mx-auto"
        >
          <button
            type="button"
            onClick={() => show('memories')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              currentScreen === 'memories'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/80 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Kenangan
          </button>
          <span className="text-rose-300 text-xs">·</span>
          <button
            type="button"
            onClick={() => show('letter')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              currentScreen === 'letter'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/80 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Surat Cinta
          </button>
          <span className="text-rose-300 text-xs">·</span>
          <button
            type="button"
            onClick={() => show('final')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              currentScreen === 'final'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/80 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Selamanya
          </button>
        </nav>
      )}

      {/* Screens container */}
      <main className="relative z-10 w-full min-h-screen">
        {currentScreen === 'lock' && (
          <LockScreen
            gfName={config.gfName}
            secretCode={config.secretCode}
            hintText={config.hintText}
            onUnlock={handleUnlock}
          />
        )}

        {currentScreen === 'memories' && (
          <MemoriesScreen
            gfName={config.gfName}
            memories={memories}
            onNext={() => show('letter')}
            onUpdateMemoryImage={handleUpdateMemoryImage}
            onBatchUpdateImages={handleBatchUpdateImages}
          />
        )}

        {currentScreen === 'letter' && (
          <LetterScreen
            gfName={config.gfName}
            finalName={config.finalName}
            letterTitle={config.letterTitle}
            letterGreeting={config.letterGreeting}
            letterBody={config.letterBody}
            letterClosing={config.letterClosing}
            onNext={() => show('final')}
          />
        )}

        {currentScreen === 'final' && (
          <FinalScreen
            config={config}
            onReplay={handleReplay}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
      </main>

      {/* Footer watermark with exact requested wording */}
      <footer className="relative z-10 py-6 text-center text-xs text-rose-400 font-serif-title">
        <span>Dibuat sepenuh hati penuh cinta untuk MILA KU SAYANG ♡</span>
      </footer>
    </div>
  );
}
