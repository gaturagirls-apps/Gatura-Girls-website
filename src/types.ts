export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: 'Academics' | 'Events' | 'Sports' | 'Announcements' | 'CBC Updates';
  imageUrl?: string;
  attachmentUrl?: string;
  createdAt?: any;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Teaching Practice';
  deadline: string;
  description: string;
  requirements: string[];
  attachmentUrl?: string;
  createdAt?: any;
}

export interface BannerAd {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  active: boolean;
  order: number;
  createdAt?: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Facilities' | 'Sports' | 'Academics' | 'Student Life';
  imageUrl: string;
  caption: string;
  createdAt?: any;
}

export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  quote: string;
  imageUrl: string;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Admissions' | 'Academics' | 'Boarding & Facilities';
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: any;
}

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  category: 'Downloads' | 'Portals' | 'Circulars' | 'KICD/CBC';
  order: number;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  order?: number;
}

export interface FeaturedVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  description?: string;
  featured?: boolean;
  order?: number;
  thumbnailUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitationProb: number;
  altitudeMeters: number;
  altitudeFeet: number;
  locationName: string;
  subCounty: string;
  county: string;
  cloudCover?: number;
  isDay?: boolean;
  weatherCode?: number;
}

export type PathwayName = 'STEM' | 'SOCIAL SCIENCES';

export interface ApprovedCombination {
  pathway: PathwayName;
  track: string;
  subjects: string[];
  code: string;
  status: 'Approved';
  recommendedCareers?: string;
}
