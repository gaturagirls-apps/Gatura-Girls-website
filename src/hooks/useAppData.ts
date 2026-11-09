import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  NewsItem,
  JobPosting,
  BannerAd,
  GalleryItem,
  LeadershipProfile,
  HeroSlide,
  FeaturedVideo,
  ContactMessage
} from '../types';

export interface AppData {
  news: NewsItem[];
  jobs: JobPosting[];
  banners: BannerAd[];
  gallery: GalleryItem[];
  leadership: LeadershipProfile[];
  heroSlides: HeroSlide[];
  featuredVideos: FeaturedVideo[];
  messages: ContactMessage[];
}

const CACHE_TTL: Record<string, number> = {
  news: 30 * 60 * 1000, // 30 minutes
  jobs: 2 * 60 * 60 * 1000, // 2 hours
  banners: 60 * 60 * 1000, // 1 hour
  gallery: 6 * 60 * 60 * 1000, // 6 hours
  leadership: 24 * 60 * 60 * 1000, // 24 hours
  heroSlides: 2 * 60 * 60 * 1000, // 2 hours
  featured_videos: 24 * 60 * 60 * 1000, // 24 hours
  messages: 5 * 60 * 1000, // 5 minutes
};

// After a failed read (e.g. quota exceeded) stop hitting Firestore for a while and serve cached data
const FAILURE_BACKOFF_MS = 15 * 60 * 1000;
const BACKOFF_KEY = 'st_teresa_fetch_backoff_until';

function inBackoff(): boolean {
  try {
    return Number(localStorage.getItem(BACKOFF_KEY) || 0) > Date.now();
  } catch (e) {
    return false;
  }
}

function startBackoff() {
  try {
    localStorage.setItem(BACKOFF_KEY, String(Date.now() + FAILURE_BACKOFF_MS));
  } catch (e) {}
}

// We store cache with timestamp
interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAllFromCache());
  const [offlineWarning, setOfflineWarning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshData(false);
  }, []);

  const refreshData = async (force: boolean = false) => {
    setIsRefreshing(true);
    setOfflineWarning(false);
    
    try {
      const collectionsMap: Record<keyof AppData, string> = {
        news: 'news',
        jobs: 'jobs',
        banners: 'banners',
        gallery: 'gallery',
        leadership: 'leadership',
        heroSlides: 'heroSlides',
        featuredVideos: 'featured_videos',
        messages: 'messages'
      };

      const now = Date.now();
      const promises: Promise<{ key: keyof AppData; data: any[] | null }>[] = [];

      for (const [key, colName] of Object.entries(collectionsMap)) {
        const typedKey = key as keyof AppData;

        // Contact messages are admin-only: visitors must not download them on every page load
        if (typedKey === 'messages' && !force) continue;
        if (!force && inBackoff()) continue;
        
        const cacheEntry = loadCacheEntry<any>(typedKey);
        const isStale = !cacheEntry || (now - cacheEntry.timestamp > (CACHE_TTL[colName] || 0));
        
        if (force || isStale) {
          promises.push(
            getDocs(collection(db, colName)).then(snapshot => {
              
              const items = snapshot.docs.map(d => {
                let data = d.data();
                // Deep optimize cloudinary urls if any
                const optimizeUrls = (obj: any) => {
                  if (!obj) return;
                  for (const k of Object.keys(obj)) {
                    if (typeof obj[k] === 'string' && obj[k].includes('res.cloudinary.com')) {
                      obj[k] = optimizeCloudinaryUrl(obj[k]);
                    } else if (typeof obj[k] === 'object') {
                      optimizeUrls(obj[k]);
                    }
                  }
                };
                optimizeUrls(data);
                return { id: d.id, ...data };
              });

              saveCache(typedKey, items);
              return { key: typedKey, data: items };
            }).catch(err => {
              console.warn(`Failed to fetch ${colName}:`, err);
              startBackoff();
              return { key: typedKey, data: null };
            })
          );
        }
      }

      if (promises.length > 0) {
        const results = await Promise.all(promises);
        let updatedData = { ...data };
        let hasChanges = false;
        
        results.forEach(res => {
          if (res.data !== null) {
            updatedData[res.key] = res.data as any;
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          setData(updatedData);
        }
      }
      
    } catch (error: any) {
      console.error('Failed to fetch from Firestore:', error);
      setOfflineWarning(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateCollection = <K extends keyof AppData>(key: K, newData: AppData[K] | ((prev: AppData[K]) => AppData[K])) => {
    setData(prev => {
      const updatedValue = typeof newData === 'function' ? (newData as Function)(prev[key]) : newData;
      const updated = { ...prev, [key]: updatedValue };
      saveCache(key, updatedValue as any[]);
      return updated;
    });
  };

  return {
    ...data,
    offlineWarning,
    isRefreshing,
    refreshData,
    updateCollection,
  };
}

function loadAllFromCache(): AppData {
  return {
    news: loadCacheData('news'),
    jobs: loadCacheData('jobs'),
    banners: loadCacheData('banners'),
    gallery: loadCacheData('gallery'),
    leadership: loadCacheData('leadership'),
    heroSlides: loadCacheData('heroSlides'),
    featuredVideos: loadCacheData('featuredVideos'),
    messages: loadCacheData('messages'),
  };
}

function loadCacheEntry<T>(key: string): CacheEntry<T> | null {
  try {
    const saved = localStorage.getItem(`st_teresa_cache_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function loadCacheData<T>(key: string): T[] {
  const entry = loadCacheEntry<T>(key);
  if (entry && Array.isArray(entry.data)) {
    return entry.data;
  } else if (Array.isArray(entry)) {
    // Handle old cache format
    return entry;
  }
  return [];
}

function saveCache<T>(key: string, data: T[]) {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`st_teresa_cache_${key}`, JSON.stringify(entry));
  } catch (e) {}
}
