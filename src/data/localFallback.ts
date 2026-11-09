/// <reference types="vite/client" />
import { GalleryItem, HeroSlide } from '../types';

/**
 * Offline / quota fallback. Drop images into:
 *   src/assets/fallback/hero/*                      -> hero slides
 *   src/assets/fallback/gallery/<Category>/*        -> gallery photos
 * where <Category> is Events, Facilities, Sports, Academics or "Student Life".
 * They are shown only when Firestore returns nothing (e.g. quota exceeded).
 */
const heroFiles = import.meta.glob('../assets/fallback/hero/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const galleryFiles = import.meta.glob('../assets/fallback/gallery/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const CATEGORIES: GalleryItem['category'][] = ['Events', 'Facilities', 'Sports', 'Academics', 'Student Life'];

const readableName = (path: string) =>
  decodeURIComponent(path.split('/').pop() || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

export const LOCAL_HERO_SLIDES: HeroSlide[] = Object.entries(heroFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, url], i) => ({
    id: `local-hero-${i}`,
    image: url,
    title: 'St. Teresa Gatura Girls',
    subtitle: 'Nurturing excellence, character and faith',
    tag: 'Welcome',
    order: i,
  }));

export const LOCAL_GALLERY: GalleryItem[] = Object.entries(galleryFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .flatMap(([path, url], i) => {
    const folder = path.split('/').slice(-2, -1)[0];
    const category = CATEGORIES.find((c) => c.toLowerCase() === folder.toLowerCase());
    if (!category) return [];
    const name = readableName(path);
    return [{ id: `local-gallery-${i}`, title: name, category, imageUrl: url, caption: name }];
  });
