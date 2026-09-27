import React, { useState } from 'react';
import { Heart, Sparkles, ChevronRight, Mail, Stamp } from 'lucide-react';
import { burstHearts } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface LetterScreenProps {
  gfName: string;
  finalName: string;
  letterTitle: string;
  letterGreeting: string;
  letterBody: string[];
  letterClosing: string;
  onNext: () => void;
}

export const LetterScreen: React.FC<LetterScreenProps> = ({
  gfName,
  finalName,
  letterTitle,
  letterGreeting,
  letterBody,
  letterClosing,
  onNext,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleOpenEnvelope = () => {
    soundManager.playUnlockChime();
    burstHearts(20);
    setIsOpen(true);
  };

  const handleNextClick = () => {
    soundManager.playSparkle();
    burstHearts(15);
    onNext();
  };

  return (
    <div
      id="letter"
      className="screen min-h-screen py-12 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center relative z-10"
    >
      {/* Ambient background glows */}
      <div className="absolute w-80 h-80 rounded-full bg-rose-200/40 blur-3xl pointer-events-none top-20 right-10" />
      <div className="absolute w-80 h-80 rounded-full bg-pink-200/40 blur-3xl pointer-events-none bottom-20 left-10" />

      {/* Screen Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-medium tracking-wide mb-3 border border-rose-200">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span>Bab 2: Dari Lubuk Hatiku</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-title font-bold text-rose-950 mb-2 tracking-tight">
          Surat Untukmu
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-serif-title italic">
          Kata-kata yang mungkin tak terucap setiap saat, tapi selalu terasa di setiap detik.
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Envelope View */
        <div className="w-full max-w-md my-8 flex flex-col items-center animate-fade-in">
          <div
            onClick={handleOpenEnvelope}
            className="w-full aspect-[16/11] bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/80 rounded-2xl shadow-xl border-2 border-rose-200/80 p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:scale-102 transition-all relative group"
          >
            {/* Stamp accent */}
            <div className="absolute top-4 right-4 border-2 border-dashed border-rose-300 p-2 rounded bg-white/60 flex items-center justify-center">
              <Stamp className="w-6 h-6 text-rose-400" />
            </div>

            {/* To line */}
            <div className="text-center mb-6">
              <span className="text-xs text-stone-400 uppercase tracking-widest font-sans">
                Untuk Kesayanganku
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-rose-950 mt-1">
                {gfName} ♡
              </h3>
            </div>

            {/* Wax Seal Button */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 shadow-lg shadow-rose-600/40 flex items-center justify-center text-white border-2 border-rose-300 transform group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <p className="mt-4 text-xs font-medium text-rose-700 font-serif-title italic animate-pulse">
              Ketuk segel lilin untuk membuka ♡
            </p>
          </div>
        </div>
      ) : (
        /* Unfolded Letter View */
        <div className="w-full bg-[#fdfbf7] p-8 sm:p-12 rounded-3xl shadow-xl border border-rose-200/70 relative mb-10 overflow-hidden animate-fade-in">
          {/* Subtle vintage parchment texture lines */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50/30 via-transparent to-amber-50/20 pointer-events-none" />

          {/* Decorative Corner flourish */}
          <div className="absolute top-4 left-4 text-rose-300 opacity-60 text-lg">
            ❦
          </div>
          <div className="absolute top-4 right-4 text-rose-300 opacity-60 text-lg">
            ❦
          </div>

          {/* Letter Stamp */}
          <div className="flex justify-end mb-6">
            <div className="border border-dashed border-rose-300 p-2 rounded bg-rose-50/50 flex flex-col items-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 mb-1" />
              <span className="text-[10px] text-rose-600 font-mono tracking-tighter uppercase">
                Kiriman Khusus
              </span>
            </div>
          </div>

          {/* Letter Header with ID "letterName" matching user script */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-rose-950 mb-1">
              Untuk <span id="letterName" className="text-rose-600 underline decoration-rose-300 underline-offset-4">{gfName}</span> Tersayang,
            </h3>
            <p className="text-xs text-stone-400 font-sans tracking-wide">
              Ditulis tulus dari lubuk hati yang terdalam
            </p>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-normal">
            {letterBody.map((paragraph, idx) => (
              <p key={idx} className="font-serif-title text-base sm:text-lg text-stone-800 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Romantic Quote highlight */}
          <div className="my-8 p-4 sm:p-5 rounded-2xl bg-rose-100/50 border-l-4 border-rose-400 italic font-serif-title text-base sm:text-lg text-rose-900 shadow-xs">
            "You are every reason, every hope, and every dream I've ever had. No matter what happens, each day I am with you is the greatest day of my life."
          </div>

          {/* Closing & Signature with finalName */}
          <div className="mt-8 pt-6 border-t border-rose-100 flex flex-col items-end">
            <p className="text-xs sm:text-sm text-stone-500 font-serif-title italic mb-1">
              {letterClosing}
            </p>
            <p className="font-script-title text-2xl sm:text-3xl font-bold text-rose-700">
              {finalName} ♡
            </p>
          </div>
        </div>
      )}

      {/* Button to Final Screen with data-next="final" */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          data-next="final"
          onClick={handleNextClick}
          className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-base shadow-lg shadow-rose-300/60 hover:shadow-rose-400/70 hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Satu Pertanyaan Terakhir...</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-xs text-rose-400 font-serif-title italic">
          aku pengen tanya seuatu ke kamu sayang ♡
        </span>
      </div>
    </div>
  );
};
