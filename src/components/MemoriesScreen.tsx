import React, { useState, useRef } from 'react';
import { MemoryItem } from '../types';
import { Heart, Calendar, MapPin, ChevronRight, X, Sparkles, BookOpen, Upload, Image as ImageIcon } from 'lucide-react';
import { burstHearts } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface MemoriesScreenProps {
  gfName: string;
  memories: MemoryItem[];
  onNext: () => void;
  onUpdateMemoryImage?: (id: string, newImageUrl: string) => void;
  onBatchUpdateImages?: (newImages: string[]) => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({
  gfName,
  memories,
  onNext,
  onUpdateMemoryImage,
  onBatchUpdateImages,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceId, setActiveReplaceId] = useState<string | null>(null);

  const handleCardClick = (memory: MemoryItem) => {
    soundManager.playSparkle();
    burstHearts(6);
    setSelectedMemory(memory);
  };

  const handleNextClick = () => {
    soundManager.playUnlockChime();
    burstHearts(12);
    onNext();
  };

  // Handle direct file upload for all 4 slots from user device
  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls: string[] = [];
    const readNext = (index: number) => {
      if (index >= files.length || index >= 4) {
        if (urls.length > 0 && onBatchUpdateImages) {
          onBatchUpdateImages(urls);
          burstHearts(15);
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          urls.push(event.target.result as string);
        }
        readNext(index + 1);
      };
      reader.readAsDataURL(files[index]);
    };

    readNext(0);
  };

  // Handle single photo replacement directly from device
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeReplaceId || !onUpdateMemoryImage) return;

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        onUpdateMemoryImage(activeReplaceId, event.target.result as string);
        burstHearts(8);
      }
      setActiveReplaceId(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerSingleReplace = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveReplaceId(id);
    if (singleInputRef.current) {
      singleInputRef.current.value = '';
      singleInputRef.current.click();
    }
  };

  return (
    <div
      id="memories"
      className="screen min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center relative z-10"
    >
      {/* Hidden file inputs for direct device photo loading */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleBatchFileChange}
      />
      <input
        ref={singleInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSingleFileChange}
      />

      {/* Decorative ambient blurred orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-rose-200/40 blur-3xl pointer-events-none top-10 left-1/4" />
      <div className="absolute w-96 h-96 rounded-full bg-pink-200/35 blur-3xl pointer-events-none bottom-20 right-1/4" />

      {/* Header section with exact requested title and subtitle */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-medium tracking-wide mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Bab 1: Cerita Kita</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-title font-bold text-rose-950 mb-3 tracking-tight">
          Kenangan sama kamu sayang ♡
        </h2>
        <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
          Setiap waktu dan foto kita berdua itu kayak keajaiban kecil yang bakal selalu ku simpen di hati. Pencet foto nya buat lihat diskripsi nyaaa, hehe (sorry agak ngeblur sayanggg)
        </p>
      </div>

      {/* Direct File Attachment Bar */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-rose-800 text-xs font-medium border border-rose-200 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer"
          title="Tempel langsung 4 file foto asli dari galeri/folder Anda"
        >
          <Upload className="w-3.5 h-3.5 text-rose-600" />
          <span>Pilih/Tempel File Foto Asli Dari Perangkat</span>
        </button>
      </div>

      {/* Polaroid Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 w-full mb-12">
        {memories.map((mem, index) => {
          // Alternating tilt for realistic polaroid scrapbook feel
          const tilts = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];
          const tiltClass = tilts[index % tilts.length];

          return (
            <div
              key={mem.id}
              onClick={() => handleCardClick(mem)}
              className={`group bg-white p-3.5 pb-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-0 cursor-pointer border border-rose-100/80 flex flex-col relative ${tiltClass}`}
            >
              {/* Washi tape graphic accent */}
              <div className="w-16 h-4 bg-rose-200/80 mx-auto -mt-5 mb-2.5 rounded-sm shadow-xs opacity-85 backdrop-blur-xs transform -rotate-1" />

              {/* Photo Container: aspect-[3/4] display */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-rose-50/50 mb-3 flex items-center justify-center border border-rose-100/50">
                <img
                  src={mem.image}
                  alt={mem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-rose-950/75 backdrop-blur-xs text-white text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-serif-title shadow-xs">
                  <Calendar className="w-3 h-3 text-rose-300" />
                  <span>{mem.date}</span>
                </div>

                {/* Direct quick replace button on each card */}
                <button
                  type="button"
                  onClick={e => triggerSingleReplace(e, mem.id)}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-stone-700 p-1.5 rounded-lg shadow-md transition-opacity text-[10px] flex items-center gap-1 font-sans"
                  title="Ganti foto ini langsung dari galeri"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Ubah Foto</span>
                </button>
              </div>

              {/* Polaroid Caption */}
              <div className="px-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-rose-950 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {mem.title}
                  </h3>
                  <p className="font-script-title text-base sm:text-lg text-rose-700 leading-snug line-clamp-2 mt-0.5">
                    "{mem.caption}"
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-100/70 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                    <BookOpen className="w-3 h-3" /> Buka foto
                  </span>
                  <Heart className="w-3.5 h-3.5 text-rose-300 group-hover:text-rose-500 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button to Love Letter with data-next="letter" */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          data-next="letter"
          onClick={handleNextClick}
          className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-base shadow-lg shadow-rose-300/60 hover:shadow-rose-400/70 hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Baca Surat Untukmu</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-xs text-rose-400 font-serif-title italic">
          Ada pesan tulus yang sudah disiapkan untukmu di dalam
        </span>
      </div>

      {/* Detail Memory Modal - Shows complete uncropped photo */}
      {selectedMemory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-200 flex flex-col relative animate-scale-up max-h-[94vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMemory(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-all backdrop-blur-xs"
              aria-label="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Uncropped Full Photo Container */}
            <div className="relative max-h-[58vh] w-full bg-stone-950 flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedMemory.image}
                alt={selectedMemory.title}
                referrerPolicy="no-referrer"
                className="max-h-[54vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-md"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pt-10 pb-3 px-4 text-white">
                <span className="text-xs text-rose-200 flex items-center gap-1.5 mb-0.5">
                  <Calendar className="w-3.5 h-3.5" /> {selectedMemory.date}
                  {selectedMemory.location && (
                    <>
                      <span>·</span>
                      <MapPin className="w-3.5 h-3.5" /> {selectedMemory.location}
                    </>
                  )}
                </span>
                <h3 className="text-lg sm:text-xl font-serif-title font-bold text-white">
                  {selectedMemory.title}
                </h3>
              </div>
            </div>

            {/* Story & Details */}
            <div className="p-5 sm:p-6 overflow-y-auto">
              <p className="font-script-title text-xl text-rose-600 mb-2">
                "{selectedMemory.caption}"
              </p>
              <p className="text-sm text-stone-700 leading-relaxed font-normal mb-4 whitespace-pre-line">
                {selectedMemory.story}
              </p>

              {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-rose-100 text-xs text-stone-500">
                  {selectedMemory.tags.map((t, idx) => (
                    <span key={idx} className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
