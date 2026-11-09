import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../types';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Filter, ChevronDown } from 'lucide-react';

interface GalleryGridProps {
  gallery: GalleryItem[];
}

const ITEMS_PER_PAGE = 6;

export const GalleryGrid: React.FC<GalleryGridProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  const categories = ['All', 'Academics', 'Facilities', 'Sports', 'Events', 'Student Life'];

  const filteredItems = useMemo(() => {
    return activeCategory === 'All'
      ? gallery
      : (gallery || []).filter(item => item.category === activeCategory);
  }, [gallery, activeCategory]);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE); // reset visible count on category change
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % displayedItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + displayedItems.length) % displayedItems.length);
    }
  };

  return (
    <section id="gallery" className="surface-alt py-24 relative overflow-hidden transition-colors">
      
      {/* Background Decorative */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="eyebrow">
            <ImageIcon className="w-4 h-4" />
            <span>Campus Life</span>
          </div>
          <h2 className="section-title">
            Photo <em>Gallery</em>
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            Experience the vibrant life, state-of-the-art facilities, and defining moments at St. Teresa Gatura Girls.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          <div className="hidden sm:flex items-center mr-2 text-slate-500 dark:text-slate-400 dark:text-slate-600">
            <Filter className="w-5 h-5" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 dark:shadow-emerald-900/50 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item, idx) => (
              <div 
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-slate-200 dark:bg-slate-800"
                onClick={() => openLightbox(idx)}
              >
                <img loading="lazy" 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider mb-3 w-max">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hover:bg-emerald-500 hover:text-slate-950">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No photos found</h3>
            <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-sm">No photos available in the "{activeCategory}" category.</p>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm shadow-emerald-500/20 hover:shadow-xl transition-all hover:scale-105"
            >
              <span>Load More</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && displayedItems[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
          <div className="absolute inset-0" onClick={closeLightbox} />
          
          <button 
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            className="absolute left-4 sm:left-10 p-3 rounded-full bg-white/10 hover:bg-emerald-500 text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            className="absolute right-4 sm:right-10 p-3 rounded-full bg-white/10 hover:bg-emerald-500 text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative z-10 max-w-5xl w-full px-4 sm:px-12 pointer-events-none flex flex-col items-center">
            <img loading="lazy" 
              src={displayedItems[lightboxIndex].imageUrl} 
              alt={displayedItems[lightboxIndex].title}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md pointer-events-auto"
            />
            <div className="mt-6 text-center pointer-events-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider mb-3">
                {displayedItems[lightboxIndex].category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                {displayedItems[lightboxIndex].title}
              </h3>
              {displayedItems[lightboxIndex].caption && (
                <p className="text-slate-300 max-w-2xl mx-auto">
                  {displayedItems[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
