import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

const QUICK_LINKS = [
  { href: '#hero', label: 'Home & Highlights' },
  { href: '#about', label: 'CBC Senior Pathways & Combinations' },
  { href: '#location', label: 'Location, Map & Live Weather' },
  { href: '#gallery', label: 'Campus Photo Gallery' },
  { href: '#news', label: 'News Noticeboard & Career Vacancies' },
  { href: '#contact', label: 'Contact Administration' },
];

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-forest-950 text-white pt-20 pb-10">
      <div aria-hidden="true" className="gingham pointer-events-none absolute inset-0 -z-10 opacity-60 [transform:scaleY(-1)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* School identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-forest-950 shadow-lg shadow-gold-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">St. Teresa Gatura Girls</h3>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
                  Senior School · Invest in Knowledge
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm font-light leading-relaxed text-white/70">
              Empowering young women through academic excellence, moral integrity, Christian faith, and holistic talent development in Gatanga Sub-County, Murang'a County, Kenya.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#contact"
                className="rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold text-forest-950 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-400"
              >
                Contact School
              </a>
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white/80 transition-colors hover:border-gold-400 hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-400">Quick Navigation</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-400">School Contacts</h4>
            <div className="space-y-4 text-sm text-white/70">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 w-4 h-4 shrink-0 text-gold-400" />
                <span>
                  Gatura, Gatanga Sub-County, P.O. Box 30-01013 Gatura, Murang'a County, Kenya{' '}
                  <a
                    href="https://www.google.com/maps?q=-0.859845,36.860207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 font-semibold text-gold-300 hover:underline"
                  >
                    (Google Map)
                  </a>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-gold-400" />
                <span>+254 793328863</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-gold-400" />
                <span>gaturagirls@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} St. Teresa Gatura Girls Senior School. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <span>MoE & KICD CBC Accredited</span>
            <button
              onClick={scrollToTop}
              className="rounded-full border border-white/20 p-2.5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500 hover:bg-gold-500 hover:text-forest-950"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
