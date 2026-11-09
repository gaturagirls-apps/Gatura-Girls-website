import React, { useState, useEffect } from 'react';
import { FeaturedVideo } from '../types';
import { Play, Film, Star, ChevronRight, ChevronLeft, Sparkles, Youtube, ExternalLink } from 'lucide-react';

interface SchoolVideosProps {
  videos: FeaturedVideo[];
  isLoading?: boolean;
}

export const SchoolVideos: React.FC<SchoolVideosProps> = ({ videos, isLoading = false }) => {
  // Sort videos: featured first, then by order
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  const [activeVideo, setActiveVideo] = useState<FeaturedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Set default active video when videos list updates
  useEffect(() => {
    if (sortedVideos.length > 0) {
      // Keep current active if valid, else fallback to first/featured
      if (!activeVideo || !sortedVideos.some(v => v.id === activeVideo.id)) {
        setActiveVideo(sortedVideos[0]);
      }
    } else {
      setActiveVideo(null);
    }
  }, [videos]);

  const handleSelectVideo = (video: FeaturedVideo) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <section id="videos" className="surface-base py-20 sm:py-24 relative overflow-hidden transition-colors">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5DFD2] dark:border-slate-700 pb-5">
          <div className="space-y-3">
            <div className="eyebrow">
              <Youtube className="w-4 h-4" />
              <span>School YouTube Channel</span>
            </div>
            <h2 className="section-title !text-[clamp(1.75rem,3vw,2.5rem)]">
              School Video <em>Highlights</em>
            </h2>
          </div>

          <a
            href="https://www.youtube.com/@STTERESAGATURAGIRLSHIGHSCHOOL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs shadow-lg shadow-forest-900/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>@STTERESAGATURAGIRLSHIGHSCHOOL</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

        {/* Loading State Skeletons */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="w-full max-w-3xl mx-auto h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : sortedVideos.length === 0 ? (
          /* Empty State */
          <div className="py-12 px-6 text-center rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Videos Added Yet</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Videos will appear here once added in the Admin Panel.
            </p>
          </div>
        ) : (
          /* Active Featured Video Player & Playlist Grid */
          <div className="space-y-6">
            
            {/* Main Compact Video Player Frame */}
            {activeVideo && (
              <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-[#E5DFD2] dark:border-slate-700 shadow-xl shadow-forest-900/10 transition-all">
                
                <div className="relative w-full aspect-video max-h-[360px]">
                  {isPlaying ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                      <img
                        src={activeVideo.thumbnailUrl || `https://img.youtube.com/vi/${activeVideo.videoId}/hqdefault.jpg`}
                        alt={activeVideo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Compact Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-sm shadow-red-600/40 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Featured Tag Badge */}
                      {activeVideo.featured && (
                        <div className="absolute top-3 left-3 inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Compact Details under player */}
                <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-[#E5DFD2] dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-[#161311] dark:text-[#F3F0E9] text-xs sm:text-sm truncate">{activeVideo.title}</h4>
                    {activeVideo.description && (
                      <p className="text-[11px] text-[#5B5346] dark:text-[#A8A196] font-light truncate">{activeVideo.description}</p>
                    )}
                  </div>

                  <a
                    href={activeVideo.youtubeUrl || `https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#161311] dark:text-[#F3F0E9] border border-transparent dark:border-slate-700 text-[11px] font-bold shrink-0 transition-colors"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            )}

            {/* Playlist Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#5B5346] dark:text-[#A8A196] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Video Playlist ({sortedVideos.length})</span>
                </span>
                <span className="text-[11px] text-[#5B5346] dark:text-[#A8A196]">Click to play</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sortedVideos.map((video) => {
                  const isActive = activeVideo?.id === video.id;
                  const thumb = video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                  return (
                    <div
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className={`group cursor-pointer rounded-xl                       overflow-hidden border transition-all duration-200 bg-white dark:bg-slate-900 ${
                        isActive 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                                                : 'border-[#E5DFD2] dark:border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-950">
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20 group-hover:bg-slate-900/0 dark:group-hover:bg-slate-950/0 transition-colors" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isActive ? 'bg-emerald-600 text-white' : 'bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white group-hover:bg-red-600 group-hover:text-white'
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-0.5">
                        <h5 className={`font-bold text-[11px] line-clamp-1 ${
                          isActive 
                            ? 'text-emerald-700 dark:text-emerald-400' 
                            : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
                        }`}>
                          {video.title}
                        </h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );

};
