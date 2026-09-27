import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw, Share2, Sparkles, Check, Clock, Edit3, X } from 'lucide-react';
import { triggerGrandCelebration, burstHearts } from '../utils/confetti';
import { soundManager } from '../utils/audio';
import { SurpriseConfig } from '../types';

interface FinalScreenProps {
  config: SurpriseConfig;
  onReplay: () => void;
  onUpdateConfig: (newConfig: Partial<SurpriseConfig>) => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  config,
  onReplay,
  onUpdateConfig,
}) => {
  const [answeredYes, setAnsweredYes] = useState<boolean>(false);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Time together counter state
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live ticking counter
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(config.anniversaryDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, now - start);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [config.anniversaryDate]);

  const handleYesClick = () => {
    setAnsweredYes(true);
    triggerGrandCelebration();
    soundManager.playUnlockChime();
  };

  const handleNoHover = () => {
    setNoHoverCount(prev => prev + 1);
    soundManager.playKeyTap(320);
    burstHearts(2);
    // Move to a playful random offset
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 100;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('gf', config.gfName);
    url.searchParams.set('code', config.secretCode);
    url.searchParams.set('from', config.finalName);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      burstHearts(5);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div
      id="final"
      className="screen min-h-screen py-12 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10"
    >
      {/* Background ambient orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-rose-300/40 blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-96 h-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none -bottom-10" />

      {/* Main Container Card */}
      <div className="w-full glass-panel p-8 sm:p-12 rounded-3xl shadow-2xl border border-rose-200/90 relative flex flex-col items-center">
        {/* Top celebration badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-pink-400 flex items-center justify-center text-white shadow-lg shadow-rose-400/50 mb-6 group">
          <Heart className="w-10 h-10 fill-current animate-pulse text-white" />
        </div>

        {/* Live Relationship Counter starting from March 2, 2026 */}
        <div className="w-full mb-8 bg-white/70 rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Saling Menyayangi Sejak 2 Maret 2026</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100/60">
              <span className="font-mono text-xl sm:text-2xl font-bold text-rose-900 tabular-nums">
                {timeTogether.days}
              </span>
              <span className="block text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                Hari
              </span>
            </div>
            <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100/60">
              <span className="font-mono text-xl sm:text-2xl font-bold text-rose-900 tabular-nums">
                {timeTogether.hours}
              </span>
              <span className="block text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                Jam
              </span>
            </div>
            <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100/60">
              <span className="font-mono text-xl sm:text-2xl font-bold text-rose-900 tabular-nums">
                {timeTogether.minutes}
              </span>
              <span className="block text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                Menit
              </span>
            </div>
            <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100/60">
              <span className="font-mono text-xl sm:text-2xl font-bold text-rose-900 tabular-nums">
                {timeTogether.seconds}
              </span>
              <span className="block text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                Detik
              </span>
            </div>
          </div>
        </div>

        {/* Big Question Section with updated texts */}
        {!answeredYes ? (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-title font-bold text-rose-950 mb-4 tracking-tight leading-snug">
              {config.questionText || `Will you continue walking together in our beautiful story, today and forever? ♡?`}
            </h2>
            <p className="text-stone-600 text-sm mb-8 font-normal">
              aku pengen setiap halamannya terus sama kamu cantikku♡
            </p>

            {/* Answer buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative min-h-[70px]">
              {/* YES Button */}
              <button
                type="button"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${1 + Math.min(noHoverCount * 0.08, 0.4)})`,
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold text-base sm:text-lg shadow-xl shadow-rose-400/60 hover:shadow-rose-500/80 active:scale-95 transition-all flex items-center gap-2 cursor-pointer z-20"
              >
                <Heart className="w-5 h-5 fill-current" />
                <span>Iya, Selamanya Bersamamu! ♡</span>
              </button>

              {/* Playful NO / DODGE Button */}
              <button
                type="button"
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                style={{
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                }}
                className="px-6 py-3 rounded-full bg-rose-100/80 text-rose-600 text-sm font-medium hover:bg-rose-200 transition-transform duration-200 active:scale-95 select-none"
              >
                {noHoverCount > 0 ? 'Eitss, nggak bisa nolak! 🙈' : 'Pikir-pikir dulu...'}
              </button>
            </div>

            {noHoverCount > 0 && (
              <p className="text-xs text-rose-500 font-serif-title italic mt-4 animate-fade-in">
                (Cuma ada satu jawaban yang benar yaa, {config.gfName}! 🥰)
              </p>
            )}
          </div>
        ) : (
          /* Celebratory Answered View */
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jawabanmu Diterima! ♡</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-rose-950 mb-3 tracking-tight">
              Seluruh Hatiku Milikmu
            </h2>
            <p className="text-base sm:text-lg font-serif-title text-stone-700 leading-relaxed mb-6 italic">
              "Aku mencintaimu bukan hanya karena siapa dirimu, tapi juga karena siapa diriku saat bersamamu."
            </p>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80 w-full text-center mb-8">
              <p className="text-xs text-rose-600 uppercase tracking-widest font-sans font-semibold mb-1">
                Ikrar Cinta Kita
              </p>
              <p className="text-base sm:text-lg font-serif-title text-rose-900 font-bold">
                {config.gfName} & {config.finalName}
              </p>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Terkunci Dalam Cinta · Hari Ini & Selamanya
              </p>
            </div>
          </div>
        )}

        {/* Sender Sign-Off */}
        <div className="mt-8 pt-6 border-t border-rose-100/90 w-full flex flex-col items-center">
          <p className="text-xs text-stone-400 font-sans tracking-wide uppercase">
            Dibuat Penuh Cinta Oleh
          </p>
          <p className="font-script-title text-2xl sm:text-3xl text-rose-600 font-bold mt-1">
            {config.finalName} ♡
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
          {/* Exact id="replay" matching user's script: document.getElementById("replay") */}
          <button
            type="button"
            id="replay"
            onClick={onReplay}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-stone-700 text-xs sm:text-sm font-medium border border-rose-200 shadow-xs hover:border-rose-300 transition-all flex items-center gap-1.5"
            title="Ulangi cerita dari layar awal"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Ulangi Cerita ↺</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-stone-700 text-xs sm:text-sm font-medium border border-rose-200 shadow-xs hover:border-rose-300 transition-all flex items-center gap-1.5"
            title="Salin tautan kejutan ini"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tautan Disalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-rose-500" />
                <span>Salin Tautan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-5 py-2.5 rounded-full bg-rose-100/60 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-medium border border-rose-200/80 transition-all flex items-center gap-1.5"
            title="Ubah nama, kode sandi, atau tanggal"
          >
            <Edit3 className="w-4 h-4 text-rose-600" />
            <span>Kustomisasi</span>
          </button>
        </div>
      </div>

      {/* Customizer Modal */}
      {showConfigModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in text-left"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 flex flex-col relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
              <div>
                <h3 className="font-serif-title font-bold text-xl text-rose-950">
                  Kustomisasi Kejutan
                </h3>
                <p className="text-xs text-stone-500">
                  Ubah 3 hal utama (atau tanggal & petunjuk)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-stone-700"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                setShowConfigModal(false);
                burstHearts(10);
              }}
              className="space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1">
                  Nama Pasangan (GF_NAME)
                </label>
                <input
                  type="text"
                  value={config.gfName}
                  onChange={e => onUpdateConfig({ gfName: e.target.value })}
                  placeholder="contoh: MILA"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 text-rose-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1">
                  Kode Rahasia (SECRET_CODE)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={config.secretCode}
                  onChange={e =>
                    onUpdateConfig({ secretCode: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="contoh: 2609"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 text-rose-950 font-mono tracking-widest font-bold"
                />
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Kode angka untuk membuka kejutan
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1">
                  Nama Kamu (FINAL_NAME)
                </label>
                <input
                  type="text"
                  value={config.finalName}
                  onChange={e => onUpdateConfig({ finalName: e.target.value })}
                  placeholder="contoh: RIAN"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 text-rose-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1">
                  Tanggal Spesial / Jadian
                </label>
                <input
                  type="date"
                  value={config.anniversaryDate}
                  onChange={e => onUpdateConfig({ anniversaryDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 text-rose-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1">
                  Teks Petunjuk (Hint)
                </label>
                <input
                  type="text"
                  value={config.hintText}
                  onChange={e => onUpdateConfig({ hintText: e.target.value })}
                  placeholder="contoh: Petunjuk: Tanggal spesial kamu (26/09)"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 text-stone-700"
                />
              </div>

              <div className="pt-3 border-t border-rose-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-md shadow-rose-300"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
