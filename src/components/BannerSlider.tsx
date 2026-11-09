import React, { useState, useEffect } from 'react';
import { BannerAd } from '../types';
import { Megaphone, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSliderProps {
  banners: BannerAd[];
}

const AUTOPLAY_MS = 6000;

export const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  const activeBanners = (banners || []).filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [activeBanners.length, currentIndex]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleCtaClick = () => {
    if (currentBanner.ctaLink && currentBanner.ctaLink !== '#admissions') {
      const elem = document.querySelector(currentBanner.ctaLink);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const fallback = document.querySelector('#contact') || document.querySelector('#about');
    if (fallback) {
      fallback.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-[#E5DFD2] dark:border-slate-700 shadow-xl shadow-forest-900/10">
        <div className="grid grid-cols-1 md:grid-cols-12">

          {/* Text Panel — solid background, always legible regardless of image */}
          <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 gap-6 order-2 md:order-1">
            <div className="space-y-4">
              <div className="eyebrow">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Announcement</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-[#161311] dark:text-[#F3F0E9]">
                {currentBanner.title}
              </h2>

              <p className="text-sm text-[#5B5346] dark:text-[#A8A196] leading-relaxed line-clamp-3">
                {currentBanner.subtitle}
              </p>
            </div>

            <div className="space-y-5">
              {currentBanner.ctaText && (
                <button
                  onClick={handleCtaClick}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm shadow-lg shadow-forest-900/20 transition-all hover:-translate-y-0.5"
                >
                  <span>{currentBanner.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}

              {activeBanners.length > 1 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
                      className="p-1.5 rounded-full border border-[#D8D0C2] dark:border-slate-700 text-[#5B5346] dark:text-[#A8A196] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      aria-label="Previous announcement"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
                      className="p-1.5 rounded-full border border-[#D8D0C2] dark:border-slate-700 text-[#5B5346] dark:text-[#A8A196] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      aria-label="Next announcement"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-1.5">
                    {activeBanners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className="relative h-[3px] flex-1 rounded-full bg-[#E5DFD2] dark:bg-slate-700 overflow-hidden"
                        aria-label={`Go to announcement ${i + 1}`}
                      >
                        {i === currentIndex && (
                          <span
                            key={currentIndex}
                            className="absolute inset-y-0 left-0 bg-gold-500 rounded-full animate-[fillbar_6s_linear]"
                            style={{ animationFillMode: 'forwards' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <span className="font-mono text-[11px] text-[#8A6D3B] dark:text-[#6B7280] tabular-nums shrink-0">
                    {String(currentIndex + 1).padStart(2, '0')}/{String(activeBanners.length).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Image Panel — letterboxed so the source image is never cropped or zoomed */}
          <div className="md:col-span-7 relative h-[220px] sm:h-[300px] md:h-[380px] order-1 md:order-2 bg-[#F0EBE0] dark:bg-slate-950 overflow-hidden">
            {/* ambient backdrop, blurred + scaled copy of the same image so there's no dead space */}
            <img
              loading="lazy"
              src={currentBanner.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-40 dark:opacity-30 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-slate-950/60 to-transparent" />

            {/* true image, fully contained — preserves its real aspect ratio */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-6">
              <img
                loading="lazy"
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-opacity duration-700"
              />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fillbar {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
};