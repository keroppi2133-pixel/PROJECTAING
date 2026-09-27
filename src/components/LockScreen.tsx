import React, { useState, useEffect } from 'react';
import { Lock, Heart, Delete, HelpCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { burstHearts } from '../utils/confetti';

interface LockScreenProps {
  gfName: string;
  secretCode: string;
  hintText: string;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  gfName,
  secretCode,
  hintText,
  onUnlock,
}) => {
  const [entered, setEntered] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const codeLength = secretCode.length || 4;

  const handleKeyPress = (digit: string) => {
    if (entered.length >= codeLength) return;

    soundManager.playKeyTap(480 + entered.length * 40);
    const nextEntered = entered + digit;
    setEntered(nextEntered);

    if (nextEntered.length === codeLength) {
      setTimeout(() => {
        if (nextEntered === secretCode) {
          soundManager.playUnlockChime();
          burstHearts(25);
          onUnlock();
        } else {
          soundManager.playErrorTone();
          setIsShaking(true);
          setErrorMessage('Kode salah, coba masukkan tanggal spesial kamu ya ♡');
          
          // Animate card matching user script specification
          const card = document.querySelector('.lock-card');
          if (card && 'animate' in card) {
            (card as HTMLElement).animate(
              [
                { transform: 'translateX(-7px)' },
                { transform: 'translateX(7px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0)' },
              ],
              { duration: 350 }
            );
          }

          setTimeout(() => {
            setEntered('');
            setIsShaking(false);
          }, 380);
        }
      }, 180);
    }
  };

  const handleBackspace = () => {
    if (entered.length > 0) {
      soundManager.playKeyTap(380);
      setEntered(prev => prev.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    soundManager.playKeyTap(340);
    setEntered('');
    setErrorMessage('');
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entered, secretCode]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      id="lock"
      className="screen active min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 relative z-10"
    >
      {/* Background soft ambient glow */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-rose-300/30 blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-pink-300/25 blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Main Lock Card */}
      <div
        className={`lock-card w-full max-w-sm p-6 sm:p-8 rounded-3xl glass-panel shadow-xl border border-rose-200/90 flex flex-col items-center text-center transition-transform duration-200 ${
          isShaking ? 'animate-shake ring-2 ring-rose-400' : ''
        }`}
      >
        {/* Heart icon header */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-lg shadow-rose-300/50 mb-5 relative group">
          <Heart className="w-8 h-8 fill-current animate-pulse text-white" />
          <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-spin" />
        </div>

        {/* Personalized Title with exact id="gfName" for user script */}
        <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-rose-950 mb-1 tracking-tight">
          Love Message For <span id="gfName" className="text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">{gfName}</span> ♡
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mb-6 font-normal">
          Masukkan kode rahasia untuk membuka
        </p>

        {/* Passcode dots indicator with id="dots" and span tags */}
        <div
          id="dots"
          className="flex items-center justify-center gap-3.5 mb-7 py-2"
          aria-label={`Panjang kode ${codeLength}`}
        >
          {Array.from({ length: codeLength }).map((_, idx) => {
            const isFilled = idx < entered.length;
            return (
              <span
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  isFilled
                    ? 'filled bg-rose-500 border-rose-500 scale-125 shadow-md shadow-rose-400/50'
                    : 'border-rose-300 bg-white/70'
                }`}
              />
            );
          })}
        </div>

        {/* Error message / feedback */}
        {errorMessage && (
          <div className="text-xs font-medium text-rose-600 mb-3 animate-fade-in">
            {errorMessage}
          </div>
        )}

        {/* Keypad grid with .keypad class and button[data-key] attributes */}
        <div className="keypad grid grid-cols-3 gap-3 w-full max-w-[270px] mb-5">
          {keys.map(key => (
            <button
              key={key}
              type="button"
              data-key={key}
              onClick={() => handleKeyPress(key)}
              className="h-14 rounded-2xl bg-white/80 hover:bg-white text-rose-950 text-xl font-semibold shadow-sm border border-rose-100 hover:border-rose-300 active:scale-95 transition-all flex items-center justify-center select-none"
            >
              {key}
            </button>
          ))}

          {/* Bottom row: Hapus / Hint, 0, Backspace */}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 text-rose-700 text-xs font-medium border border-rose-100 active:scale-95 transition-all flex flex-col items-center justify-center select-none"
            title="Hapus semua"
          >
            Hapus
          </button>

          <button
            type="button"
            data-key="0"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white/80 hover:bg-white text-rose-950 text-xl font-semibold shadow-sm border border-rose-100 hover:border-rose-300 active:scale-95 transition-all flex items-center justify-center select-none"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 text-rose-700 text-sm border border-rose-100 active:scale-95 transition-all flex items-center justify-center select-none"
            title="Hapus satu angka"
            aria-label="Hapus digit terakhir"
          >
            <Delete className="w-5 h-5 text-rose-600" />
          </button>
        </div>

        {/* Hint toggle */}
        <div className="pt-2 border-t border-rose-100/80 w-full flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-rose-500 hover:text-rose-700 inline-flex items-center gap-1.5 transition-colors font-medium py-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showHint ? 'Sembunyikan petunjuk' : 'Butuh petunjuk?'}
          </button>
          {showHint && (
            <p className="mt-2 text-xs text-stone-600 bg-rose-50/80 px-3 py-1.5 rounded-lg border border-rose-200/60 animate-fade-in font-serif-title italic">
              {hintText || `Petunjuk: Tanggal spesial kamu (${secretCode})`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
