import React, { useState } from 'react';
import { LeadershipProfile } from '../types';
import { Quote, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface LeadershipProps {
  profiles: LeadershipProfile[];
}

export const Leadership: React.FC<LeadershipProps> = ({ profiles }) => {
  const sortedProfiles = [...profiles].sort((a, b) => a.order - b.order);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (sortedProfiles.length === 0) return null;

  const currentLeader = sortedProfiles[selectedIndex];

  // --- Shared style helpers (removes repeated / conflicting Tailwind strings) ---

  const arrowButtonClasses =
    'p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#161311] dark:text-[#F3F0E9] border border-[#E5DFD2] dark:border-slate-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors';

  const getThumbnailClasses = (isSelected: boolean) => {
    const base = 'p-4 rounded-2xl text-left border transition-all shadow-sm';
    return isSelected
      ? `${base} bg-white dark:bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400`
      : `${base} bg-white dark:bg-slate-900 border-[#E5DFD2] dark:border-slate-700 text-[#161311] dark:text-[#F3F0E9] hover:border-emerald-400`;
  };

  return (
    <section id="leadership" className="surface-alt py-24 relative transition-colors overflow-hidden">

      {/* Background Subtle Highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="eyebrow">
            <ShieldCheck className="w-4 h-4" />
            <span>School Administration</span>
          </div>
          <h2 className="section-title">
            Visionary School <em>Leadership</em>
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <p className="text-[#5B5346] dark:text-[#A8A196] text-base sm:text-lg">
            Guiding St. Teresa Gatura Girls with faith, integrity, academic rigour, and a steadfast devotion to student success.
          </p>
        </div>

        {/* Featured Leader Card */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 text-[#161311] dark:text-[#F3F0E9] p-6 sm:p-10 lg:p-12 border border-[#E5DFD2] dark:border-slate-700 shadow-xl shadow-forest-900/10 overflow-hidden mb-12">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Leader Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-md group">
                <img
                  loading="lazy"
                  src={currentLeader.imageUrl}
                  alt={currentLeader.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Intentionally dark overlay on the photo itself (not page background) — kept as-is in both themes for legibility of the badge below */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-center text-slate-900 dark:text-white">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    {currentLeader.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Leader Bio & Quote */}
            <div className="lg:col-span-7 space-y-6">

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  {currentLeader.role}
                </span>
                {/* FIX: was hardcoded text-white with no light-mode color — invisible on the white card */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161311] dark:text-[#F3F0E9]">
                  {currentLeader.name}
                </h3>
                <p className="text-sm text-[#5B5346] dark:text-[#A8A196] font-medium">
                  {currentLeader.title}
                </p>
              </div>

              {/* Quote box */}
              <div className="relative p-6 rounded-2xl bg-slate-900/5 dark:bg-slate-800 border border-[#E5DFD2] dark:border-slate-700 backdrop-blur-md space-y-3">
                <Quote className="w-8 h-8 text-emerald-700 dark:text-emerald-400 opacity-80" />
                <p className="text-base sm:text-lg italic text-[#161311] dark:text-[#F3F0E9] leading-relaxed">
                  "{currentLeader.quote}"
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#5B5346] dark:text-[#A8A196] leading-relaxed font-light">
                {currentLeader.bio}
              </p>

            </div>

          </div>

          {/* Navigation Arrows for Leaders */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E5DFD2] dark:border-slate-700">
            <div className="text-xs text-[#5B5346] dark:text-[#A8A196] font-medium" aria-live="polite">
              Profile {selectedIndex + 1} of {sortedProfiles.length}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  setSelectedIndex((prev) => (prev - 1 + sortedProfiles.length) % sortedProfiles.length)
                }
                className={arrowButtonClasses}
                aria-label="Previous leadership profile"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedIndex((prev) => (prev + 1) % sortedProfiles.length)}
                className={arrowButtonClasses}
                aria-label="Next leadership profile"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Thumbnail Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="tablist" aria-label="Leadership profiles">
          {sortedProfiles.map((leader, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={leader.id}
                onClick={() => setSelectedIndex(idx)}
                className={getThumbnailClasses(isSelected)}
                role="tab"
                aria-selected={isSelected}
                aria-current={isSelected ? 'true' : undefined}
              >
                <div className="flex items-center space-x-3">
                  <img
                    loading="lazy"
                    src={leader.imageUrl}
                    alt={leader.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-emerald-500/30"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{leader.name}</p>
                    {/* FIX: duplicate dark: classes (dark:text-slate-500 AND dark:text-slate-400) — kept the latter, single source of truth */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{leader.role}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};