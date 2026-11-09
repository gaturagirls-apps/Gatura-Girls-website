import React from 'react';
import { ArrowRight, CalendarCheck } from 'lucide-react';

// From this month (0-based, so 10 = November) the year is nearly over and
// families are planning for the following January intake.
const NEXT_INTAKE_FROM_MONTH = 10;

export const getIntakeYear = (now: Date = new Date()): number =>
  now.getMonth() >= NEXT_INTAKE_FROM_MONTH ? now.getFullYear() + 1 : now.getFullYear();

export const isIntakeSeason = (now: Date = new Date()): boolean =>
  now.getMonth() >= NEXT_INTAKE_FROM_MONTH;

export const AdmissionsStrip: React.FC = () => {
  const now = new Date();
  const year = getIntakeYear(now);
  const season = isIntakeSeason(now);

  return (
    <section
      id="admissions"
      aria-label="Admissions"
      className="relative isolate overflow-hidden border-y border-gold-500/30 bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white"
    >
      <div aria-hidden="true" className="gingham pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="max-w-2xl space-y-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-300">
            <CalendarCheck className="h-4 w-4" />
            <span>{season ? `Admissions · ${year} Intake` : 'Admissions'}</span>
          </p>
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {season ? (
              <>
                <span className="gold-shimmer gold-shimmer-dark italic">{year}</span> Grade 10 Intake
              </>
            ) : (
              <>Grade 10 CBC Senior Secondary Placement</>
            )}
          </h2>
          <p className="text-sm font-light leading-relaxed text-white/75 sm:text-base">
            {season
              ? `Planning ahead for ${year}? Speak to our administration about Grade 10 placement, requirements and the subject combinations we offer.`
              : 'Speak to our administration about Grade 10 placement, requirements and the subject combinations we offer.'}
          </p>
        </div>

        <a
          href="#contact"
          className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-forest-950 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-400 md:self-auto"
        >
          <span>{season ? `Enquire about ${year} Intake` : 'Make an Enquiry'}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
};
