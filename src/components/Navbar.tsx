import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  PhoneCall,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAdmin: () => void;
}

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About & Programs' },
  { id: 'location', label: 'Location' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'news', label: 'News & Jobs' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  onOpenAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll state, scroll progress bar and scroll-spy for the active link
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 30);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }

      let current = NAV_LINKS[0].id;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [setActiveSection]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Transparent over the dark hero, solid ivory/forest once scrolled
  const onHero = !scrolled && !mobileMenuOpen;

  const getLinkClasses = (isActive: boolean) => {
    const base =
      'relative whitespace-nowrap px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold-500 after:transition-transform after:duration-500 after:ease-out';
    const tone = onHero
      ? 'text-white/75 hover:text-white'
      : 'text-[#3d382f] hover:text-forest-700 dark:text-[#cfc9bc] dark:hover:text-white';
    const underline = isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100';
    const activeTone = isActive ? (onHero ? '!text-white' : '!text-forest-700 dark:!text-gold-300') : '';
    return `${base} ${tone} ${activeTone} ${underline}`;
  };

  const iconButtonClasses = `p-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 ${
    onHero
      ? 'border-white/20 text-white hover:bg-white/10'
      : 'border-[#e5dfd2] text-[#14120f] hover:bg-forest-700/5 dark:border-slate-700 dark:text-[#f3f0e9] dark:hover:bg-white/5'
  }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#faf7f2]/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(18,51,37,0.45)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* Logo & School Name */}
          <div
            onClick={() => handleNavClick('hero')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('hero');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="St. Teresa Gatura Girls - go to home section"
            className="flex items-center gap-3 cursor-pointer group rounded-lg shrink-0"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-forest-950 shadow-lg shadow-gold-500/25 ring-2 ring-white/10 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-display text-lg font-semibold tracking-tight transition-colors duration-300 ${
                  onHero ? 'text-white' : 'text-[#14120f] dark:text-[#f6f2ea]'
                }`}
              >
                St. Teresa Gatura Girls
              </span>
              <span
                className={`hidden sm:block text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  onHero ? 'text-gold-300' : 'text-forest-600 dark:text-gold-400'
                }`}
              >
                Senior School · Est. 1976
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden xl:flex items-center">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={getLinkClasses(isActive)}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold text-sm shadow-lg shadow-gold-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Contact Us</span>
            </a>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconButtonClasses}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenAdmin}
              aria-label="Admin portal login"
              title="Admin Portal Login"
              className={iconButtonClasses}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconButtonClasses}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="p-2.5 rounded-full bg-gold-500 text-forest-950 shadow-lg shadow-gold-500/25 transition-transform duration-300 hover:scale-105"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden px-4 pb-6 pt-4">
          <div className="rounded-3xl p-5 border border-[#e5dfd2] dark:border-slate-700 bg-white/90 dark:bg-forest-900/90 backdrop-blur-2xl shadow-xl text-[#14120f] dark:text-[#f3f0e9] space-y-4 animate-[hero-rise_500ms_ease-out_both]">
            <nav aria-label="Mobile primary" className="grid grid-cols-1 gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-700 text-white'
                        : 'hover:bg-forest-700/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'opacity-40'}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#e5dfd2] dark:border-slate-700 space-y-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gold-500 text-forest-950 font-semibold shadow-lg shadow-gold-500/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact Administration</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                aria-label="Admin portal login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#e5dfd2] dark:border-slate-700 text-sm font-medium hover:bg-forest-700/5 dark:hover:bg-white/5"
              >
                <ShieldCheck className="w-4 h-4 text-forest-600 dark:text-gold-400" />
                <span>Admin Portal Login</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll progress */}
      <div
        aria-hidden="true"
        ref={progressRef}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-gold-300"
      />
    </header>
  );
};
