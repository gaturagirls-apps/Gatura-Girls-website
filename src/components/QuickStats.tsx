import React, { useEffect, useRef, useState } from 'react';
import { Users, Award, BookOpenCheck, Sparkles } from 'lucide-react';
import { APPROVED_COMBINATIONS } from '../data/approvedPathways';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animates the first number found in `value` (e.g. "850+", "56 Approved") once `start` is true
const CountUp: React.FC<{ value: string; start: boolean }> = ({ value, start }) => {
  const match = value.match(/\d+/);
  const target = match ? parseInt(match[0], 10) : 0;
  const prefix = match ? value.slice(0, match.index) : '';
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : value;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start || !match) return;
    if (prefersReducedMotion()) {
      setCurrent(target);
      return;
    }

    const duration = 1600;
    const began = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - began) / duration, 1);
      setCurrent(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  if (!match) return <>{value}</>;

  return (
    <>
      {prefix}
      {start ? current : 0}
      {suffix}
    </>
  );
};

export const QuickStats: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      label: 'Enrolled Students',
      value: '850+',
      description: 'Bright young girls across approved CBC Senior Pathways',
      icon: Users
    },
    {
      label: 'University/College Transition',
      value: '100%',
      description: 'Graduates joining top public & global universities',
      icon: Award
    },
    {
      label: 'Approved CBC Combinations',
      value: `${APPROVED_COMBINATIONS.length} Approved`,
      description: 'Across the STEM & Social Sciences pathways',
      icon: BookOpenCheck
    },
    {
      label: 'Co-Curricular Clubs',
      value: '25+',
      description: 'Drama, Music, Sports & Journalism',
      icon: Sparkles
    }
  ];

  return (
    <section className="relative z-20 -mt-24 sm:-mt-28 pb-14" aria-label="School at a glance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="stat-card card-lift relative overflow-hidden rounded-2xl border border-[#e5dfd2] bg-white p-6 shadow-xl shadow-forest-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-forest-600 to-forest-800 text-gold-300 shadow-lg shadow-forest-800/30 ring-2 ring-gold-300/50">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-display text-4xl font-semibold tracking-tight text-forest-800 tabular-nums dark:text-[#f6f2ea]">
                  <CountUp value={stat.value} start={visible} />
                </p>
                <p className="mt-2 text-sm font-semibold text-[#14120f] dark:text-[#f3f0e9]">{stat.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#5b5346] dark:text-[#a8a196]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
