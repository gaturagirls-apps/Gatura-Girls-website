import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { HeroSlide } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';

interface HeroProps {
  onExplorePrograms: () => void;
  slides?: HeroSlide[];
}

const CREDENTIALS = [
  'STEM & Social Sciences Pathways',
  '100% Transition Rate',
  'Christian Character & Discipline'
];

const SLIDE_MS = 6000;

export const Hero: React.FC<HeroProps> = ({ onExplorePrograms, slides }) => {
  // Respect admin slides: if slides prop is passed, use it (even if empty array). Only fallback to initial if slides prop is undefined.
  const activeSlides = slides !== undefined ? slides : INITIAL_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (activeSlides.length > 0 && currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [activeSlides.length, currentSlide]);

  const nextSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }
  };

  const prevSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  const slide = activeSlides[currentSlide];

  return (
    <section
      id="hero"
      className="hero-bg relative isolate min-h-[100svh] pt-32 pb-36 sm:pb-40 flex items-center overflow-hidden text-white"
    >
      {/* Textures: uniform check + soft golden light */}
      <div aria-hidden="true" className="gingham pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="hero-orb pointer-events-none absolute -top-32 -right-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-gold-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">

          {/* Left: message */}
          <div className="lg:col-span-7 space-y-8 text-left">

            <div className="hero-rise hero-rise-1 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-300">
              <span className="h-px w-8 bg-gold-400" />
              <span>Catholic Diocese of Murang'a · Est. 1976</span>
            </div>

            <h1 className="hero-rise hero-rise-2 font-display text-[2.6rem] sm:text-6xl lg:text-[4.4rem] font-semibold leading-[1.04] tracking-[-0.025em] text-balance">
              Empowering young women for{' '}
              <em className="gold-shimmer gold-shimmer-dark font-medium italic">global</em> leadership.
            </h1>

            <p className="hero-rise hero-rise-3 text-base sm:text-lg text-white/75 font-light max-w-xl leading-relaxed">
              A Senior Secondary School offering the approved{' '}
              <strong className="text-white font-semibold">Competency-Based Curriculum (CBC)</strong>{' '}
              Senior Secondary Pathways, Grade 10–12, with state-of-the-art STEM, Humanities, and
              Creative Arts facilities.
            </p>

            <ul className="hero-rise hero-rise-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-7 gap-y-3">
              {CREDENTIALS.map((label) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="hero-rise hero-rise-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExplorePrograms}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold text-base shadow-xl shadow-gold-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore CBC Pathways</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/25 hover:border-gold-400 hover:bg-white/5 text-white font-medium text-base transition-all duration-300"
              >
                <span>Contact School Administration</span>
              </a>
            </div>
          </div>

          {/* Right: arched photograph */}
          <div className="hero-arch-in lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md">

              <div className="arch-frame relative isolate aspect-[4/5]">
              <div className="absolute inset-0 shine overflow-hidden rounded-t-[999px] rounded-b-3xl bg-forest-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
                {activeSlides.length > 0 ? (
                  <>
                    {activeSlides.map((s, i) => (
                      <img
                        key={s.id || `${s.image}-${i}`}
                        src={s.image}
                        alt={i === currentSlide ? s.title || 'St. Teresa Gatura Girls' : ''}
                        aria-hidden={i !== currentSlide}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className={`slide-image absolute inset-0 h-full w-full object-cover ${
                          i === currentSlide ? 'is-active' : ''
                        }`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 space-y-3">
                      <span className="inline-block rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest-950">
                        {slide?.tag || 'Senior School'}
                      </span>
                      <div key={currentSlide} className="space-y-1 animate-[hero-rise_700ms_ease-out_both]">
                        <p className="font-display text-xl font-semibold leading-snug">
                          {slide?.title || 'Life at St. Teresa Gatura'}
                        </p>
                        {slide?.subtitle && (
                          <p className="text-xs text-white/70 line-clamp-2">{slide.subtitle}</p>
                        )}
                      </div>

                      {activeSlides.length > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1.5">
                            {activeSlides.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  currentSlide === idx ? 'w-7 bg-gold-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to photo ${idx + 1}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={prevSlide}
                              className="p-2 rounded-full border border-white/25 text-white hover:bg-gold-500 hover:border-gold-500 hover:text-forest-950 transition-colors"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={nextSlide}
                              className="p-2 rounded-full border border-white/25 text-white hover:bg-gold-500 hover:border-gold-500 hover:text-forest-950 transition-colors"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                      <Award className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">St. Teresa Gatura Girls</h3>
                    <p className="max-w-xs text-xs text-white/70">
                      Empowering young women through academic excellence, moral integrity, and leadership.
                    </p>
                  </div>
                )}
              </div>
              </div>

              {/* 50 years medallion */}
              <div className="float-soft shine absolute -left-4 top-14 sm:-left-10 sm:top-16 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-forest-700 to-forest-900 shadow-2xl shadow-black/30 ring-1 ring-gold-300/60">
                <svg viewBox="0 0 120 120" className="spin-slow absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)]" aria-hidden="true">
                  <defs>
                    <path id="medallion-ring" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
                  </defs>
                  <text className="fill-gold-300" fontSize="9.5" fontWeight="700" letterSpacing="3.2">
                    <textPath href="#medallion-ring">INVEST IN KNOWLEDGE • 1976 — 2026 •</textPath>
                  </text>
                </svg>
                <div className="relative text-center leading-none">
                  <p className="font-display text-3xl sm:text-4xl font-semibold text-gold-300">50</p>
                  <p className="mt-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-white/80">Years</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
