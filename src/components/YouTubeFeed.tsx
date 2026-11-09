import React, { useState } from 'react';
import { Youtube, Play, ExternalLink, ArrowUpRight } from 'lucide-react';

const YOUTUBE_VIDEOS = [
  {
    id: 'anthem-2025',
    youtubeId: 'L_LUpnjgPso',
    title: 'St. Teresa Gatura Girls Senior School Anthem & Morning Devotion',
    duration: '4:15',
    category: 'School Anthem',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'The school choir performs the official St. Teresa Gatura Girls Anthem during assembly.'
  },
  {
    id: 'cbc-science-fair',
    youtubeId: '3JZ_D3ELwOQ',
    title: '2026 CBC Senior Secondary Science & Robotics Exhibition',
    duration: '8:40',
    category: 'Innovation',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    description: 'Grade 10 STEM students showcase solar water purification and coding projects.'
  },
  {
    id: 'drama-gala',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'National Drama Festival 2025 — St. Teresa Drama Club Winners',
    duration: '12:10',
    category: 'Arts & Culture',
    thumbnail: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
    description: 'Stage performance by our award-winning drama team at the Kenya National Theatre.'
  },
  {
    id: 'principal-speech',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Principal\'s Address: Welcome to St. Teresa Gatura Girls Senior School',
    duration: '6:30',
    category: 'Address',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Sr. Beatrice Mwangi outlines the school values and CBC Senior School pathway opportunities.'
  }
];

const CHANNEL_HANDLE = '@STTERESAGATURAGIRLSHIGHSCHOOL';
const CHANNEL_ID = 'UC-kMsQwdGF2pawrfT6xixTg';

export const YouTubeFeed: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(YOUTUBE_VIDEOS[0]);
  const activeIndex = YOUTUBE_VIDEOS.findIndex((v) => v.id === activeVideo.id);

  return (
    <section className="relative py-24 bg-[#FAF7F2] dark:bg-[#07100B] text-[#161311] dark:text-[#F3F0E9] transition-colors overflow-hidden">
      {/* faint tuning-dial texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(120,110,95,0.18) 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Masthead */}
        <div className="flex flex-col gap-6 border-b border-[#D8D0C2] dark:border-[#1E2A24] pb-8 mb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8A6D3B] dark:text-[#D4A24C]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              On the Channel
            </div>
            <a
              href={`https://www.youtube.com/${CHANNEL_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#161311] dark:text-[#F3F0E9] border-b border-current pb-0.5"
            >
              Subscribe on YouTube
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="font-black uppercase leading-[0.92] tracking-tight text-[13vw] sm:text-6xl lg:text-7xl">
              Campus
              <br />
              <span className="text-red-600 dark:text-red-500">Broadcast</span>
            </h2>
            <p className="max-w-sm text-sm sm:text-[15px] text-[#5B5346] dark:text-[#A8A196] leading-relaxed lg:pb-2">
              Assemblies, music festivals, CBC science exhibitions and campus
              life — recorded and streamed from St. Teresa Gatura Girls'
              official channel.
            </p>
          </div>
        </div>

        {/* Channel strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#161311] dark:bg-[#F3F0E9] text-[#FAF7F2] dark:text-[#07100B] flex items-center justify-center font-black text-sm shrink-0">
              ST
            </div>
            <div className="leading-tight">
              <p className="font-bold">St. Teresa Gatura Girls High School</p>
              <p className="font-mono text-[#8A6D3B] dark:text-[#D4A24C] text-[11px]">{CHANNEL_HANDLE}</p>
            </div>
          </div>
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#8A6D3B] dark:text-[#A8A196] hover:text-red-600 dark:hover:text-red-500 transition-colors truncate"
          >
            {CHANNEL_ID} ↗
          </a>
        </div>

        {/* Player + Channel Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Player */}
          <div className="lg:col-span-7 space-y-5">
            <div className="relative rounded-sm overflow-hidden bg-black border border-[#D8D0C2] dark:border-[#1E2A24] shadow-[6px_6px_0_0_#161311] dark:shadow-[6px_6px_0_0_#D4A24C] aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-sm bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Now Playing
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-[#D8D0C2] dark:border-[#1E2A24] pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-1.5">
                  {activeVideo.category}
                </p>
                <h3 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                  {activeVideo.title}
                </h3>
                <p className="text-sm text-[#5B5346] dark:text-[#A8A196] leading-relaxed max-w-xl">
                  {activeVideo.description}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs text-[#8A6D3B] dark:text-[#D4A24C] tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(YOUTUBE_VIDEOS.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Channel guide */}
          <div className="lg:col-span-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A6D3B] dark:text-[#A8A196] mb-3 pl-1">
              Channel Guide
            </p>
            <div className="border-t border-[#D8D0C2] dark:border-[#1E2A24]">
              {YOUTUBE_VIDEOS.map((video, i) => {
                const isSelected = activeVideo.id === video.id;
                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`group w-full flex items-center gap-4 py-4 border-b border-[#D8D0C2] dark:border-[#1E2A24] text-left transition-colors ${
                      isSelected ? '' : 'hover:bg-[#F0EBE0] dark:hover:bg-[#131826]'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs tabular-nums w-6 shrink-0 ${
                        isSelected
                          ? 'text-red-600 dark:text-red-500 font-bold'
                          : 'text-[#B8ADA0] dark:text-[#4A5268]'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="relative w-20 h-12 shrink-0 overflow-hidden rounded-sm bg-[#E5DFD2] dark:bg-[#131826]">
                      <img
                        loading="lazy"
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play
                          className={`w-3.5 h-3.5 fill-current ${
                            isSelected ? 'text-red-500' : 'text-white/90'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] font-semibold truncate leading-snug ${
                          isSelected ? 'text-red-600 dark:text-red-500' : ''
                        }`}
                      >
                        {video.title}
                      </p>
                      <p className="font-mono text-[10px] text-[#8A6D3B] dark:text-[#6B7280] mt-0.5">
                        {video.category} · {video.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};