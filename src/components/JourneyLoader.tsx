import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Opening "journey" shown while the site loads: a minibus drives the route
 * Thika -> Gatanga -> Kirwara -> Gatura, narrating directions as it goes.
 * The bus only reaches Gatura once the page, fonts and above-the-fold images
 * are ready (with a hard cap so a slow network can never trap a visitor).
 */

const STOPS = [
  { name: 'Thika', title: 'Leaving Thika', line: 'The highway falls behind and the foothills lie ahead.' },
  { name: 'Gatanga', title: 'Climbing to Gatanga', line: 'Green hills and winding roads open up on every side.' },
  { name: 'Kirwara', title: 'Through Kirwara', line: 'Nearly there. The Aberdare foothills rise in the distance.' },
  { name: 'Gatura', title: 'Welcome to Gatura', line: 'St. Teresa Gatura Girls Senior School. Invest in Knowledge.' },
];

// Where each stop sits along the road (0 = start, 1 = end)
const STOP_AT = [0, 0.34, 0.67, 1];
// Progress at which the narration moves on to the next stop
const STAGE_AT = [0.12, 0.45, 0.9];

const VB_W = 1000;
const VB_H = 320;
const ROAD = 'M 30 262 C 160 262 200 205 330 210 C 470 215 500 262 640 250 C 780 238 830 175 945 180';

const SEEN_KEY = 'gatura-journey-seen';
const HARD_CAP_MS = 10000;

const TREES = [
  [70, 238, 0.9], [120, 232, 0.7], [210, 222, 1], [262, 228, 0.75], [395, 232, 0.9], [450, 238, 0.7],
  [560, 236, 1], [610, 242, 0.75], [715, 232, 0.9], [770, 226, 0.7], [850, 220, 1], [905, 214, 0.8],
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageIsReady = () => {
  if (document.readyState !== 'complete') return false;
  if (document.fonts && document.fonts.status === 'loading') return false;
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('header img, #hero img:not([loading="lazy"])'));
  return imgs.every((img) => img.complete);
};

type Phase = 'travelling' | 'arrived' | 'leaving' | 'done';

export const JourneyLoader: React.FC = () => {
  // Read-only here (no storage writes) so it stays pure under StrictMode
  const [firstVisit] = useState(() => {
    try {
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return true;
    }
  });
  const [enabled] = useState(() => !prefersReducedMotion());
  const [phase, setPhase] = useState<Phase>(enabled ? 'travelling' : 'done');
  const [stage, setStage] = useState(0);
  const [passed, setPassed] = useState(1);
  const [stopPts, setStopPts] = useState<{ x: number; y: number }[]>([]);

  const roadRef = useRef<SVGPathElement>(null);
  const busRef = useRef<SVGGElement>(null);
  const beamRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const dayRef = useRef<SVGRectElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef(false);

  const minMs = firstVisit ? 4800 : 1500;

  // Freeze scrolling and hold the hero animations until the journey ends
  useLayoutEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('is-loading');
    return () => document.documentElement.classList.remove('is-loading');
  }, [enabled]);

  // Measure where the stops sit on the road
  useLayoutEffect(() => {
    const road = roadRef.current;
    if (!road) return;
    const len = road.getTotalLength();
    setStopPts(
      STOP_AT.map((f) => {
        const pt = road.getPointAtLength(len * f);
        return { x: pt.x, y: pt.y };
      })
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the full journey simply plays each time */
    }

    const road = roadRef.current;
    if (!road) return;
    const len = road.getTotalLength();

    let frame = 0;
    let last = performance.now();
    const start = last;
    let p = 0;
    let ready = false;
    let lastReadyCheck = 0;
    let currentStage = 0;
    let currentPassed = 1;
    let arrivedAt = 0;
    let leavingAt = 0;
    let current: Phase = 'travelling';

    const arrivedHold = firstVisit ? 1300 : 350;
    const leaveDuration = 1000;

    const draw = (progress: number) => {
      const here = road.getPointAtLength(len * progress);
      const ahead = road.getPointAtLength(len * Math.min(progress + 0.012, 1));
      const behind = road.getPointAtLength(len * Math.max(progress - 0.012, 0));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      busRef.current?.setAttribute('transform', `translate(${here.x} ${here.y}) rotate(${angle})`);
      beamRef.current?.setAttribute('opacity', String(Math.max(0, 0.95 - progress * 1.1)));
      sunRef.current?.setAttribute('transform', `translate(0 ${130 - progress * 130})`);
      dayRef.current?.setAttribute('opacity', String(Math.pow(progress, 0.8)));
      starsRef.current?.setAttribute('opacity', String(Math.max(0, 1 - progress * 1.6)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(progress * 100)}`;

      const nextStage = STAGE_AT.filter((t) => progress >= t).length;
      if (nextStage !== currentStage) {
        currentStage = nextStage;
        setStage(nextStage);
      }
      const nextPassed = STOP_AT.filter((f) => progress >= f - 0.01).length;
      if (nextPassed !== currentPassed) {
        currentPassed = nextPassed;
        setPassed(nextPassed);
      }
    };

    draw(0);

    const tick = (now: number) => {
      // The first frame timestamp can precede our own start time by a few ms
      const dt = Math.max(0, now - last);
      last = Math.max(last, now);
      const elapsed = Math.max(0, now - start);

      if (current === 'travelling') {
        if (now - lastReadyCheck > 150) {
          lastReadyCheck = now;
          ready = pageIsReady() || elapsed > HARD_CAP_MS;
        }

        if (skipRef.current) {
          p = 1;
        } else {
          // Keep a steady pace; hold just short of Gatura until everything is ready
          const timeTarget = Math.min(elapsed / minMs, 1);
          const cap = ready && elapsed >= minMs ? 1 : 0.86;
          const target = Math.min(timeTarget, cap);
          p = Math.min(target, p + dt / minMs);
        }
        draw(p);

        if (p >= 1) {
          current = 'arrived';
          arrivedAt = now;
          setPhase('arrived');
        }
      } else if (current === 'arrived') {
        if (now - arrivedAt > (skipRef.current ? 0 : arrivedHold)) {
          current = 'leaving';
          leavingAt = now;
          setPhase('leaving');
        }
      } else if (current === 'leaving') {
        if (now - leavingAt > leaveDuration) {
          current = 'done';
          document.documentElement.classList.remove('is-loading');
          setPhase('done');
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, firstVisit, minMs]);

  if (phase === 'done') return null;

  return (
    <div
      className={`journey ${phase === 'arrived' || phase === 'leaving' ? 'journey--arrived' : ''} ${
        phase === 'leaving' ? 'journey--leaving' : ''
      }`}
      aria-busy="true"
    >
      <div className="journey-bar journey-bar--top" aria-hidden="true" />
      <div className="journey-bar journey-bar--bottom" aria-hidden="true" />

      <div className="journey-inner">
        <img src="/logo.png" alt="" className="journey-crest" width={360} height={420} />
        <p className="journey-kicker">Directions to St. Teresa Gatura Girls</p>

        <div key={stage} className="journey-copy" role="status" aria-live="polite">
          <p className="journey-title">{STOPS[stage].title}</p>
          <p className="journey-line">{STOPS[stage].line}</p>
        </div>

        <div className="journey-scene" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="journey-svg" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="jv-night" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#06130d" />
                <stop offset="1" stopColor="#123325" />
              </linearGradient>
              <linearGradient id="jv-day" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1f5f43" />
                <stop offset="0.62" stopColor="#d9ad45" />
                <stop offset="1" stopColor="#f6e5b4" />
              </linearGradient>
              <radialGradient id="jv-sun">
                <stop offset="0" stopColor="#fff6d6" />
                <stop offset="0.35" stopColor="#f6e5b4" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ecce7c" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="jv-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff1c2" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff1c2" stopOpacity="0" />
              </linearGradient>
              <g id="jv-tree">
                <rect x="-1.6" y="-6" width="3.2" height="8" fill="#0a1d14" />
                <path d="M0 -40 L-12 -16 L12 -16 Z M0 -28 L-15 -5 L15 -5 Z" fill="currentColor" />
              </g>
            </defs>

            <rect width={VB_W} height={VB_H} fill="url(#jv-night)" />
            <rect ref={dayRef} width={VB_W} height={VB_H} fill="url(#jv-day)" opacity="0" />

            <g ref={starsRef}>
              {[[80, 40], [190, 70], [300, 28], [420, 60], [540, 34], [650, 76], [760, 30], [880, 58], [950, 24], [130, 100], [610, 108]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#fff7dc" className="journey-star" style={{ animationDelay: `${i * 0.37}s` }} />
              ))}
            </g>

            <g ref={sunRef}>
              <circle cx="772" cy="105" r="86" fill="url(#jv-sun)" />
              <circle cx="772" cy="105" r="26" fill="#fff3c9" />
            </g>

            <g className="journey-cloud" opacity="0.5">
              <ellipse cx="220" cy="82" rx="46" ry="11" fill="#f4efe0" />
              <ellipse cx="248" cy="74" rx="30" ry="10" fill="#f4efe0" />
            </g>
            <g className="journey-cloud journey-cloud--slow" opacity="0.38">
              <ellipse cx="640" cy="58" rx="52" ry="12" fill="#f4efe0" />
              <ellipse cx="672" cy="50" rx="32" ry="10" fill="#f4efe0" />
            </g>

            {/* Aberdare range, then rolling hills */}
            <path d="M0 205 L85 150 L165 186 L268 108 L362 172 L452 124 L560 192 L662 98 L762 172 L862 118 L942 166 L1000 140 L1000 320 L0 320 Z" fill="#0f3626" />
            <path d="M0 238 Q130 188 262 224 T520 214 T780 230 T1000 196 V320 H0 Z" fill="#165a3d" />
            {TREES.map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`} color={i % 2 ? '#0e3a28' : '#134a33'}>
                <use href="#jv-tree" />
              </g>
            ))}
            <path d="M0 278 Q200 256 420 270 T820 264 T1000 272 V320 H0 Z" fill="#0c2218" />

            {/* Road */}
            <path d={ROAD} fill="none" stroke="#0a1a12" strokeWidth="24" strokeLinecap="round" />
            <path ref={roadRef} d={ROAD} fill="none" stroke="#33463d" strokeWidth="17" strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="#f6e5b4" strokeWidth="2.2" strokeDasharray="9 13" strokeLinecap="round" className="journey-dash" />

            {/* Stops */}
            {stopPts.map((s, i) => (
              <g key={STOPS[i].name}>
                {i === Math.min(passed, STOPS.length - 1) && i !== 0 && (
                  <circle cx={s.x} cy={s.y} r="10" fill="none" stroke="#ecce7c" strokeWidth="2" className="journey-ping" />
                )}
                <circle cx={s.x} cy={s.y} r="7.5" fill={i < passed ? '#ecce7c' : '#123325'} stroke={i < passed ? '#fff3c9' : '#ecce7c'} strokeWidth="2.2" />
              </g>
            ))}

            {/* The minibus */}
            <g ref={busRef}>
              <path ref={beamRef} d="M34 -13 L120 -34 L120 6 Z" fill="url(#jv-beam)" />
              <g className="journey-bus">
                <ellipse cx="0" cy="3" rx="32" ry="3.4" fill="#000" opacity="0.28" />
                <rect x="-33" y="-31" width="66" height="25" rx="7" fill="#f6e5b4" />
                <rect x="-33" y="-18" width="66" height="5.5" fill="#2d8059" />
                <rect x="-28" y="-27.5" width="12" height="9" rx="2" fill="#123325" />
                <rect x="-12" y="-27.5" width="12" height="9" rx="2" fill="#123325" />
                <rect x="4" y="-27.5" width="12" height="9" rx="2" fill="#123325" />
                <path d="M20 -27.5 H29 Q32 -27.5 32 -24.5 V-18.5 H20 Z" fill="#1d4a37" />
                <circle cx="-19" cy="-5" r="6.4" fill="#14120f" />
                <circle cx="19" cy="-5" r="6.4" fill="#14120f" />
                <circle cx="-19" cy="-5" r="2.5" fill="#dcb04a" />
                <circle cx="19" cy="-5" r="2.5" fill="#dcb04a" />
                <rect x="31" y="-15" width="3.4" height="4.4" rx="1" fill="#fff1c2" />
              </g>
            </g>
          </svg>

          {/* Place names: HTML so they stay readable on small screens */}
          {stopPts.map((s, i) => (
            <span
              key={STOPS[i].name}
              className={`journey-stop ${i < passed ? 'journey-stop--passed' : ''}`}
              style={{ left: `${(s.x / VB_W) * 100}%`, top: `${(s.y / VB_H) * 100}%` }}
            >
              {STOPS[i].name}
            </span>
          ))}
        </div>

        <div className="journey-progress" aria-hidden="true">
          <div className="journey-track">
            <div ref={barRef} className="journey-fill" />
          </div>
          <span className="journey-pct">
            <span ref={pctRef}>0</span>%
          </span>
        </div>

        <button
          type="button"
          className="journey-skip"
          onClick={() => {
            skipRef.current = true;
          }}
        >
          Skip the journey
        </button>
      </div>
    </div>
  );
};
