import { NewsItem, JobPosting, BannerAd, GalleryItem, LeadershipProfile, FAQItem, UsefulLink, HeroSlide, FeaturedVideo } from '../types';

export const INITIAL_NEWS: NewsItem[] = [];

export const INITIAL_BANNERS: BannerAd[] = [];

export const INITIAL_JOBS: JobPosting[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_LEADERSHIP: LeadershipProfile[] = [];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Where is St. Teresa Gatura Girls Senior School located?',
    answer: 'The school is located in Gatura Market, Gatanga Sub-County, Murang\'a County, Kenya — situated along the scenic foothills of the Aberdare Ranges at an elevation of approximately 1,880 meters above sea level. It is easily accessible via the Thika-Gatanga-Gatura tarmac road.',
    category: 'General',
    order: 1
  },
  {
    id: 'f2',
    question: 'What academic curriculum and approved CBC senior pathways are offered?',
    answer: 'St. Teresa Gatura Girls is a dedicated Senior Secondary School offering the approved Competency-Based Curriculum (CBC) for Grade 10–12. The school is officially approved by the Ministry of Education & KICD for both senior pathways with 54 approved combinations: STEM (Pure & Applied Sciences — 26 combinations, taking Advanced Mathematics) and Social Sciences (Humanities & Business Studies, Languages & Literature — 28 combinations, taking Essential Mathematics). Every learner also takes the compulsory core subjects: Mathematics, English, Kiswahili, Community Service Learning (CSL), ICT and Physical Education (PE), then chooses 3 pathway subjects.',
    category: 'Academics',
    order: 2
  },
  {
    id: 'f3',
    question: 'How do I apply for Grade 10 CBC Senior Secondary Placement?',
    answer: 'Inquiries and applications for Grade 10 CBC Senior Secondary School placement can be made directly at the school principal\'s office during working hours or via our official website contact form and school administration email (gaturagirls@gmail.com). Requirements include Grade 9 KPSEA results slips, birth certificate copy, junior secondary leaving certificate, and medical report.',
    category: 'Admissions',
    order: 3
  },
  {
    id: 'f4',
    question: 'What boarding facilities and amenities are provided?',
    answer: 'We provide self-contained boarding hostels with hot water solar showers, modern dining hall serving nutritious balanced meals, 24/7 security with CCTV & security personnel, sickbay staffed by a qualified nurse, and an expansive sports complex.',
    category: 'Boarding & Facilities',
    order: 4
  },
  {
    id: 'f5',
    question: 'What co-curricular activities and clubs exist at the school?',
    answer: 'Students actively participate in Journalism & Media, Science & Robotics, Drama & Music, Red Cross, St. John Ambulance, Presidents Award Scheme, Environmental Club, Christian Union, Catholic Action, Volleyball, Basketball, Football, Lawn Tennis, and Badminton.',
    category: 'General',
    order: 5
  }
];

export const INITIAL_LINKS: UsefulLink[] = [
  {
    id: 'l1',
    title: '2026 Term 1 School Fees Structure & Bank Details (PDF)',
    url: '#',
    category: 'Downloads',
    order: 1
  },
  {
    id: 'l2',
    title: 'Grade 10 Senior Secondary Pathway Selection Guide (KICD)',
    url: '#',
    category: 'KICD/CBC',
    order: 2
  },
  {
    id: 'l3',
    title: 'Parent-Teacher Association (PTA) Term Circular & Calendar',
    url: '#',
    category: 'Circulars',
    order: 3
  },
  {
    id: 'l4',
    title: 'Student E-Learning & Revision Portal Access',
    url: '#',
    category: 'Portals',
    order: 4
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [];

export const INITIAL_FEATURED_VIDEOS: FeaturedVideo[] = [];

