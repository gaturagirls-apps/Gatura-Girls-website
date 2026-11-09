import React from 'react';

const VALUES = ['Faith', 'Excellence', 'Discipline', 'Service', 'Invest in Knowledge'];

const Row: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {VALUES.map((value) => (
      <li key={value} className="flex items-center">
        <span className="px-8 font-display text-2xl sm:text-3xl font-medium italic text-white/90">{value}</span>
        <span className="text-gold-400 text-lg">✦</span>
      </li>
    ))}
  </ul>
);

export const ValuesMarquee: React.FC = () => (
  <section
    aria-label="Our values: Faith, Excellence, Discipline, Service"
    className="marquee relative overflow-hidden bg-forest-900 py-7 border-y border-gold-500/20"
  >
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track">
        <Row />
        <Row hidden />
        <Row hidden />
        <Row hidden />
        <Row hidden />
        <Row hidden />
      </div>
    </div>
  </section>
);
