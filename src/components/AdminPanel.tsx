import React, { useState } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signOut
} from '../firebase';
import { 
  newsService, 
  jobsService, 
  bannersService, 
  galleryService, 
  leadershipService, 
  heroSlidesService, 
  featuredVideosService, 
  messagesService 
} from '../services/firebaseService';
import { NewsItem, JobPosting, BannerAd, GalleryItem, LeadershipProfile, ContactMessage, UsefulLink, HeroSlide, FeaturedVideo } from '../types';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtube';
import { getStoredCloudinaryConfig, saveCloudinaryConfig, uploadToCloudinary, compressImageFileToDataUrl, CloudinaryConfig } from '../utils/cloudinary';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  LogOut, 
  Newspaper, 
  Briefcase, 
  Image as ImageIcon, 
  Users, 
  MessageSquare, 
  Link as LinkIcon,
  CheckCircle,
  CheckCircle2,
  Eye,
  Megaphone,
  Upload,
  Camera,
  Layers,
  UserPlus,
  Film,
  Star,
  Play,
  Loader2,
  Check,
  Cloud,
  CloudUpload,
  Settings,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
  jobs: JobPosting[];
  banners: BannerAd[];
  gallery: GalleryItem[];
  leadership: LeadershipProfile[];
  heroSlides?: HeroSlide[];
  featuredVideos?: FeaturedVideo[];
  messages: ContactMessage[];
  links: UsefulLink[];
  onRefreshData: (force?: boolean) => void;
  setNews?: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  setJobs?: React.Dispatch<React.SetStateAction<JobPosting[]>>;
  setBanners?: React.Dispatch<React.SetStateAction<BannerAd[]>>;
  setGallery?: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  setLeadership?: React.Dispatch<React.SetStateAction<LeadershipProfile[]>>;
  setHeroSlides?: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  setFeaturedVideos?: React.Dispatch<React.SetStateAction<FeaturedVideo[]>>;
  setMessages?: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  news,
  jobs,
  banners,
  gallery,
  leadership,
  heroSlides = [],
  featuredVideos = [],
  messages,
  links,
  onRefreshData,
  setNews,
  setJobs,
  setBanners,
  setGallery,
  setLeadership,
  setHeroSlides,
  setFeaturedVideos,
  setMessages
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'hero' | 'videos' | 'leadership' | 'gallery' | 'banners' | 'news' | 'jobs' | 'messages'>('hero');

  // Video Form state & Edit mode state
  const [videoForm, setVideoForm] = useState<{
    id?: string;
    title: string;
    youtubeUrl: string;
    description: string;
    featured: boolean;
    order: number;
    thumbnailUrl: string;
  }>({
    title: '',
    youtubeUrl: '',
    description: '',
    featured: false,
    order: 1,
    thumbnailUrl: ''
  });
  const [isEditingVideo, setIsEditingVideo] = useState<boolean>(false);
  const [isVideoSaving, setIsVideoSaving] = useState<boolean>(false);
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

  // Custom Toast & Confirmation Dialog state (iframe sandbox safe)
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    actionLabel?: string;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // New Item Form states
  const [newHero, setNewHero] = useState({ title: '', subtitle: '', tag: 'Senior Secondary', image: '' });
  const [newLeader, setNewLeader] = useState({ name: '', role: '', title: '', bio: '', quote: '', imageUrl: '' });
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', content: '', category: 'Academics', imageUrl: '' });
  const [newJob, setNewJob] = useState({ title: '', department: '', employmentType: 'Full-time', deadline: '', description: '', requirementsStr: '' });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', imageUrl: '', ctaText: 'Explore Pathways', ctaLink: '#about' });
  const [newGallery, setNewGallery] = useState({ title: '', category: 'Academics', imageUrl: '', caption: '' });

  // Cloudinary State & Gallery Editing State
  const [cloudinaryConfig, setCloudinaryConfig] = useState<CloudinaryConfig>(() => getStoredCloudinaryConfig());
  const [showCloudinaryConfig, setShowCloudinaryConfig] = useState<boolean>(false);
  const [isCloudinaryUploading, setIsCloudinaryUploading] = useState<boolean>(false);
  const [cloudinaryStatusMsg, setCloudinaryStatusMsg] = useState<string>('');
  
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGallerySaving, setIsGallerySaving] = useState<boolean>(false);


  React.useEffect(() => {
    if (isOpen) {
      onRefreshData(true);
    }
    // onRefreshData is a new function every render; depending on it re-triggered a forced refetch in a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;


  // Save Cloudinary configuration
  const handleSaveCloudinarySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudinaryConfig.cloudName.trim()) {
      showToast('Please enter your Cloudinary Cloud Name.');
      return;
    }
    saveCloudinaryConfig(cloudinaryConfig);
    setShowCloudinaryConfig(false);
    showToast('Cloudinary settings saved successfully!');
  };

  // Upload single photo to Cloudinary
  const handleCloudinarySingleUpload = async (file: File, setUrl: (url: string) => void) => {
    setIsCloudinaryUploading(true);
    setCloudinaryStatusMsg(`Uploading "${file.name}" to Cloudinary...`);
    try {
      const res = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.uploadPreset);
      setUrl(res.url);
      showToast('Photo uploaded to Cloudinary CDN!');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsCloudinaryUploading(false);
      setCloudinaryStatusMsg('');
    }
  };

  // Batch Upload photos to Cloudinary and create Firestore Gallery entries
  const handleCloudinaryBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsCloudinaryUploading(true);

    const fileList: File[] = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setCloudinaryStatusMsg(`Processing photo ${i + 1} of ${fileList.length}: "${file.name}"...`);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

      try {
        const res = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.uploadPreset);
        await galleryService.create({
          title: formattedTitle,
          category: newGallery.category || 'Academics',
          imageUrl: res.url,
          caption: `School Gallery • ${new Date().toLocaleDateString()}`
        });
        successCount++;
      } catch (err: any) {
        alert(`Error processing gallery item ${file.name}: ${err.message}`);
      }
    }
    setIsCloudinaryUploading(false);
    setCloudinaryStatusMsg('');
    onRefreshData(true); showToast(`Batch Upload Complete! Added ${successCount} photo(s) to gallery.`);
  };
  // File upload helper routes to Cloudinary single upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Please select an image smaller than 15MB.');
      return;
    }

    await handleCloudinarySingleUpload(file, setUrl);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (password === 'admin123' || password === 'gatura2027') {
      setIsAuthenticated(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError('Invalid credentials. (Demo passkey: admin123 or gatura2027)');
    }
  };

  // 1. Add Hero Slide
  const handleAddHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHero.image) {
      alert('Please upload an image or provide an image URL for the hero slide.');
      return;
    }
    const id = `hero_${Date.now()}`;
    const newSlide: HeroSlide = {
      id,
      title: newHero.title,
      subtitle: newHero.subtitle,
      tag: newHero.tag,
      image: newHero.image,
      order: heroSlides.length + 1
    };

    if (setHeroSlides) {
      setHeroSlides(prev => [...prev, newSlide]);
    }

    try {
      await heroSlidesService.create({
        ...newHero,
        order: heroSlides.length + 1
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }

    setNewHero({ title: '', subtitle: '', tag: 'Senior Secondary', image: '' });
    showToast('New Hero photo slide published successfully!');
  };

  const handleDeleteHero = (id: string) => {
    setConfirmModal({
      title: 'Delete Hero Slide Photo',
      message: 'Are you sure you want to delete this Hero photo slide from the website?',
      actionLabel: 'Yes, Delete Slide',
      onConfirm: async () => {
        if (setHeroSlides) {
          setHeroSlides(prev => prev.filter(h => h.id !== id));
        }
        try {
          await heroSlidesService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Hero slide deleted successfully.');
      }
    });
  };

  // --- FEATURED VIDEOS CRUD HANDLERS ---
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      showToast('Video title is required.');
      return;
    }
    const videoId = extractYouTubeVideoId(videoForm.youtubeUrl);
    if (!videoId) {
      showToast('Please enter a valid YouTube video URL or 11-character video ID.');
      return;
    }

    // Duplicate check for new records
    if (!isEditingVideo && featuredVideos.some(v => v.videoId === videoId)) {
      showToast(`A video with YouTube ID "${videoId}" already exists in playlist.`);
      return;
    }

    const orderVal = Number(videoForm.order) > 0 ? Number(videoForm.order) : (featuredVideos.length + 1);
    const thumbnailUrl = videoForm.thumbnailUrl.trim() || getYouTubeThumbnailUrl(videoId);
    const formattedUrl = videoForm.youtubeUrl.startsWith('http') 
      ? videoForm.youtubeUrl 
      : `https://www.youtube.com/watch?v=${videoId}`;

    setIsVideoSaving(true);

    const videoObj: FeaturedVideo = {
      id: videoForm.id || `video_${Date.now()}`,
      title: videoForm.title.trim(),
      youtubeUrl: formattedUrl,
      videoId,
      description: videoForm.description.trim(),
      featured: videoForm.featured,
      order: orderVal,
      thumbnailUrl
    };

    if (setFeaturedVideos) {
      if (isEditingVideo && videoForm.id) {
        setFeaturedVideos(prev => prev.map(v => v.id === videoForm.id ? videoObj : v));
      } else {
        setFeaturedVideos(prev => [...prev, videoObj]);
      }
    }

    try {
      if (isEditingVideo && videoForm.id) {
        await featuredVideosService.update(videoForm.id, {
          title: videoForm.title.trim(),
          youtubeUrl: formattedUrl,
          videoId,
          description: videoForm.description.trim(),
          featured: videoForm.featured,
          order: orderVal,
          thumbnailUrl
        });
        showToast('Featured video updated successfully!');
      } else {
        await featuredVideosService.create({
          title: videoForm.title.trim(),
          youtubeUrl: formattedUrl,
          videoId,
          description: videoForm.description.trim(),
          featured: videoForm.featured,
          order: orderVal,
          thumbnailUrl
        });
        showToast('New featured video added to playlist!');
      }
    } catch (err) {
      console.log('Firestore offline mode fallback:', err);
    } finally {
      setIsVideoSaving(false);
      setVideoForm({
        title: '',
        youtubeUrl: '',
        description: '',
        featured: false,
        order: featuredVideos.length + 2,
        thumbnailUrl: ''
      });
      setIsEditingVideo(false);
    }
  };

  const handleEditVideo = (video: FeaturedVideo) => {
    setVideoForm({
      id: video.id,
      title: video.title,
      youtubeUrl: video.youtubeUrl || `https://www.youtube.com/watch?v=${video.videoId}`,
      description: video.description || '',
      featured: !!video.featured,
      order: video.order || 1,
      thumbnailUrl: video.thumbnailUrl || ''
    });
    setIsEditingVideo(true);
  };

  const handleDeleteVideo = (id: string, title: string) => {
    setConfirmModal({
      title: 'Delete Featured Video',
      message: `Are you sure you want to delete "${title}" from featured videos playlist?`,
      actionLabel: 'Yes, Delete Video',
      onConfirm: async () => {
        if (setFeaturedVideos) {
          setFeaturedVideos(prev => prev.filter(v => v.id !== id));
        }
        try {
          await featuredVideosService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Video removed from playlist.');
      }
    });
  };

  const handleCancelEditVideo = () => {
    setVideoForm({
      title: '',
      youtubeUrl: '',
      description: '',
      featured: false,
      order: featuredVideos.length + 1,
      thumbnailUrl: ''
    });
    setIsEditingVideo(false);
  };

  // 2. Add Leadership Profile
  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeader.imageUrl) {
      showToast('Please upload a profile photo or enter a photo URL.');
      return;
    }
    const leaderObj: LeadershipProfile = {
      id: `leader_${Date.now()}`,
      ...newLeader,
      order: leadership.length + 1
    };
    if (setLeadership) {
      setLeadership(prev => [...prev, leaderObj]);
    }
    try {
      await leadershipService.create({
        ...newLeader,
        order: leadership.length + 1
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }
    setNewLeader({ name: '', role: '', title: '', bio: '', quote: '', imageUrl: '' });
    showToast('Leadership profile & photo published!');
  };

  const handleDeleteLeader = (id: string) => {
    setConfirmModal({
      title: 'Delete Leadership Profile',
      message: 'Are you sure you want to delete this leadership profile and photo?',
      actionLabel: 'Yes, Delete Profile',
      onConfirm: async () => {
        if (setLeadership) {
          setLeadership(prev => prev.filter(l => l.id !== id));
        }
        try {
          await leadershipService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Leadership profile deleted.');
      }
    });
  };

  // 3. Add News Item
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newsObj: NewsItem = {
      id: `news_${Date.now()}`,
      ...newNews,
      date: dateStr
    };
    if (setNews) {
      setNews(prev => [newsObj, ...prev]);
    }
    try {
      await newsService.create({
        ...newNews,
        date: dateStr
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }
    setNewNews({ title: '', excerpt: '', content: '', category: 'Academics', imageUrl: '' });
    showToast('News article & photo published!');
  };

  const handleDeleteNews = (id: string) => {
    setConfirmModal({
      title: 'Delete News Article',
      message: 'Are you sure you want to delete this news article from the noticeboard?',
      actionLabel: 'Yes, Delete Article',
      onConfirm: async () => {
        if (setNews) {
          setNews(prev => prev.filter(n => n.id !== id));
        }
        try {
          await newsService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('News article deleted.');
      }
    });
  };

  // 4. Add Career Job
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = newJob.requirementsStr.split('\n').filter(r => r.trim() !== '');
    const jobObj: JobPosting = {
      id: `job_${Date.now()}`,
      title: newJob.title,
      department: newJob.department,
      employmentType: newJob.employmentType,
      deadline: newJob.deadline,
      description: newJob.description,
      requirements
    };
    if (setJobs) {
      setJobs(prev => [...prev, jobObj]);
    }
    try {
      await jobsService.create({
        title: newJob.title,
        department: newJob.department,
        employmentType: newJob.employmentType,
        deadline: newJob.deadline,
        description: newJob.description,
        requirements
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }
    setNewJob({ title: '', department: '', employmentType: 'Full-time', deadline: '', description: '', requirementsStr: '' });
    showToast('Job vacancy published!');
  };

  const handleDeleteJob = (id: string) => {
    setConfirmModal({
      title: 'Remove Job Opportunity',
      message: 'Are you sure you want to delete this job vacancy posting?',
      actionLabel: 'Yes, Remove Job',
      onConfirm: async () => {
        if (setJobs) {
          setJobs(prev => prev.filter(j => j.id !== id));
        }
        try {
          await jobsService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Job vacancy removed.');
      }
    });
  };

  // 5. Add Banner Ad
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.imageUrl) {
      showToast('Please select or paste a banner image URL.');
      return;
    }
    const bannerObj: BannerAd = {
      id: `banner_${Date.now()}`,
      ...newBanner,
      active: true,
      order: banners.length + 1
    };
    if (setBanners) {
      setBanners(prev => [...prev, bannerObj]);
    }
    try {
      await bannersService.create({
        ...newBanner,
        active: true,
        order: banners.length + 1
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }
    setNewBanner({ title: '', subtitle: '', imageUrl: '', ctaText: 'Explore Pathways', ctaLink: '#about' });
    showToast('Promotional banner added!');
  };

  const handleDeleteBanner = (id: string) => {
    setConfirmModal({
      title: 'Remove Promotional Banner',
      message: 'Are you sure you want to delete this promotional banner?',
      actionLabel: 'Yes, Remove Banner',
      onConfirm: async () => {
        if (setBanners) {
          setBanners(prev => prev.filter(b => b.id !== id));
        }
        try {
          await bannersService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Promotional banner removed.');
      }
    });
  };

  // 6. Add & Update Gallery Photo
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.imageUrl) {
      showToast('Please upload an image file or provide an image URL.');
      return;
    }
    const galleryObj: GalleryItem = {
      id: `gallery_${Date.now()}`,
      ...newGallery
    };
    if (setGallery) {
      setGallery(prev => [galleryObj, ...prev]);
    }
    try {
      await galleryService.create({
        ...newGallery
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    }
    setNewGallery({ title: '', category: 'Academics', imageUrl: '', caption: '' });
    showToast('Photo added to campus gallery!');
  };

  const handleUpdateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    setIsGallerySaving(true);
    if (setGallery) {
      setGallery(prev => prev.map(g => g.id === editingGalleryItem.id ? editingGalleryItem : g));
    }
    try {
      await galleryService.update(editingGalleryItem.id, {
        title: editingGalleryItem.title,
        category: editingGalleryItem.category,
        imageUrl: editingGalleryItem.imageUrl,
        caption: editingGalleryItem.caption || ''
      });
    } catch (err) {
      console.log('Firestore offline mode fallback');
    } finally {
      setIsGallerySaving(false);
      setEditingGalleryItem(null);
      showToast('Gallery photo details updated successfully!');
    }
  };

  const handleDeleteGallery = (id: string) => {
    setConfirmModal({
      title: 'Delete Gallery Photo',
      message: 'Are you sure you want to remove this photo from the campus gallery?',
      actionLabel: 'Yes, Delete Photo',
      onConfirm: async () => {
        if (setGallery) {
          setGallery(prev => prev.filter(g => g.id !== id));
        }
        try {
          await galleryService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Gallery photo deleted.');
      }
    });
  };

  const handleDeleteMessage = (id: string) => {
    setConfirmModal({
      title: 'Delete Contact Message',
      message: 'Are you sure you want to delete this contact inquiry message?',
      actionLabel: 'Yes, Delete Message',
      onConfirm: async () => {
        if (setMessages) {
          setMessages(prev => prev.filter(m => m.id !== id));
        }
        try {
          await messagesService.delete(id);
        } catch (err) {
          console.log('Firestore offline mode fallback');
        }
        showToast('Inquiry message deleted.');
      }
    });
  };

  // --- WIPE ALL DUMMY ITEMS HANDLERS ---
  const handleClearAllGallery = () => {
    setConfirmModal({
      title: 'Wipe All Campus Gallery Photos',
      message: 'Are you sure you want to delete ALL photos in the Campus Gallery to start completely fresh?',
      actionLabel: 'Yes, Clear All Gallery Photos',
      onConfirm: async () => {
        if (setGallery) setGallery([]);
        try {
          await galleryService.clearAll();
        } catch (e) {
          console.log('Error clearing gallery docs:', e);
        }
        showToast('All gallery photos have been cleared.');
      }
    });
  };

  const handleClearAllHero = () => {
    setConfirmModal({
      title: 'Remove All Hero Photo Slides',
      message: 'Are you sure you want to delete ALL Hero photos?',
      actionLabel: 'Yes, Clear All Hero Slides',
      onConfirm: async () => {
        if (setHeroSlides) setHeroSlides([]);
        try {
          await heroSlidesService.clearAll();
        } catch (e) {
          console.log('Error clearing hero docs:', e);
        }
        showToast('All hero slides cleared.');
      }
    });
  };

  const handleClearAllLeader = () => {
    setConfirmModal({
      title: 'Remove All Leadership Profiles',
      message: 'Are you sure you want to delete ALL Leadership profiles?',
      actionLabel: 'Yes, Clear All Leadership Profiles',
      onConfirm: async () => {
        if (setLeadership) setLeadership([]);
        try {
          await leadershipService.clearAll();
        } catch (e) {
          console.log('Error clearing leadership docs:', e);
        }
        showToast('All leadership profiles cleared.');
      }
    });
  };

  const handleClearAllBanners = () => {
    setConfirmModal({
      title: 'Remove All Promotional Banners',
      message: 'Are you sure you want to delete ALL promotional banners?',
      actionLabel: 'Yes, Clear All Banners',
      onConfirm: async () => {
        if (setBanners) setBanners([]);
        try {
          await bannersService.clearAll();
        } catch (e) {
          console.log('Error clearing banner docs:', e);
        }
        showToast('All banners cleared.');
      }
    });
  };

  const handleClearAllNews = () => {
    setConfirmModal({
      title: 'Remove All News Posts',
      message: 'Are you sure you want to delete ALL news articles?',
      actionLabel: 'Yes, Clear All News Posts',
      onConfirm: async () => {
        if (setNews) setNews([]);
        try {
          await newsService.clearAll();
        } catch (e) {
          console.log('Error clearing news docs:', e);
        }
        showToast('All news articles cleared.');
      }
    });
  };

  const handleClearAllJobs = () => {
    setConfirmModal({
      title: 'Remove All Job Vacancies',
      message: 'Are you sure you want to delete ALL job postings?',
      actionLabel: 'Yes, Clear All Job Postings',
      onConfirm: async () => {
        if (setJobs) setJobs([]);
        try {
          await jobsService.clearAll();
        } catch (e) {
          console.log('Error clearing job docs:', e);
        }
        showToast('All job postings cleared.');
      }
    });
  };

  const handleClearAllVideos = () => {
    setConfirmModal({
      title: 'Remove All Featured Videos',
      message: 'Are you sure you want to delete ALL featured videos?',
      actionLabel: 'Yes, Clear All Videos',
      onConfirm: async () => {
        if (setFeaturedVideos) setFeaturedVideos([]);
        try {
          await featuredVideosService.clearAll();
        } catch (e) {
          console.log('Error clearing video docs:', e);
        }
        showToast('All featured videos cleared.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center space-x-2 animate-bounce border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Custom Confirmation Modal (iframe safe, no browser popup blocking) */}
      {confirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-500/40 rounded-3xl p-6 space-y-5 shadow-md relative">
            <div className="flex items-center space-x-3 text-red-500 dark:text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 shrink-0">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{confirmModal.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Please confirm this action</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(null);
                  await action();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm shadow-red-600/30 transition-all"
              >
                {confirmModal.actionLabel || 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">School Photo & Content Admin Console</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">St. Teresa Gatura Girls Senior School • Upload & Manage Website Photos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowCloudinaryConfig(!showCloudinaryConfig)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  cloudinaryConfig.cloudName 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                }`}
                title="Cloudinary Photo Storage Settings"
              >
                <Cloud className="w-4 h-4" />
                <span className="hidden sm:inline">Cloudinary CDN</span>
                {cloudinaryConfig.cloudName && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse ml-1" />}
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 text-slate-600 dark:text-slate-300 hover:text-red-400 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN FORM IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Administrator Login</h4>
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">Enter administration credentials or demo passkey to update website photos</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stteresagaturagirls.sc.ke"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Password / Access Key *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. admin123)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                />
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">Hint: Demo Passkey is <strong>admin123</strong> or <strong>gatura2027</strong></p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm shadow-emerald-500/20"
              >
                Authenticate & Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="space-y-6">

            {/* CLOUDINARY CONFIGURATION SETTINGS PANEL */}
            {(showCloudinaryConfig || !cloudinaryConfig.cloudName) && (
              <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-gradient-to-br dark:from-blue-950/60 dark:to-slate-900 border border-blue-200 dark:border-blue-500/30 space-y-4 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-500/20 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cloudinary Image CDN Settings</h4>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold">Photo Gallery Engine</span>
                  </div>
                  {cloudinaryConfig.cloudName && (
                    <button
                      type="button"
                      onClick={() => setShowCloudinaryConfig(false)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveCloudinarySettings} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-xs font-bold text-blue-900 dark:text-blue-200">Cloudinary Cloud Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. gaturagirls or dxyz123"
                      value={cloudinaryConfig.cloudName}
                      onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-blue-300 dark:border-blue-500/30 text-slate-900 dark:text-white text-xs focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Found in your Cloudinary Dashboard under Account Details.</p>
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-blue-900 dark:text-blue-200">Unsigned Upload Preset</label>
                    <input
                      type="text"
                      placeholder="ml_default or school_gallery"
                      value={cloudinaryConfig.uploadPreset}
                      onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, uploadPreset: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-blue-300 dark:border-blue-500/30 text-slate-900 dark:text-white text-xs focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Set up under Settings → Upload → Upload Presets (Unsigned).</p>
                  </div>

                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Cloudinary Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-300 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'hero' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Hero Photos ({heroSlides.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'videos' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Film className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Featured Videos ({featuredVideos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leadership')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'leadership' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Leadership Photos ({leadership.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'gallery' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery Photos ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'banners' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Banners ({banners.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'news' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>News & Notices ({news.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'jobs' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Careers ({jobs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'messages' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries ({messages.length})</span>
              </button>
            </div>

            {/* TAB: FEATURED VIDEOS MANAGEMENT */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Video Add/Edit Form */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                      <Film className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEditingVideo ? 'Edit Featured Video' : 'Add New Featured Video'}</span>
                    </h4>
                    {isEditingVideo && (
                      <button
                        type="button"
                        onClick={handleCancelEditVideo}
                        className="text-[11px] text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveVideo} className="space-y-4">
                    {/* 1. Video Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">1. Video Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. School Anthem 2024"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                      />
                    </div>

                    {/* 2. YouTube Video Link / ID */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">2. YouTube Video Link or ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://www.youtube.com/watch?v=XXXXXXXX or XXXXXXXX"
                        value={videoForm.youtubeUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          const extracted = extractYouTubeVideoId(val);
                          setVideoForm({
                            ...videoForm,
                            youtubeUrl: val,
                            // Auto populate default thumbnail if thumb input is empty
                            thumbnailUrl: (!videoForm.thumbnailUrl && extracted) ? getYouTubeThumbnailUrl(extracted) : videoForm.thumbnailUrl
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                      />
                      {videoForm.youtubeUrl && (
                        <div className="mt-1 text-[11px]">
                          {extractYouTubeVideoId(videoForm.youtubeUrl) ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Detected Video ID: <strong>{extractYouTubeVideoId(videoForm.youtubeUrl)}</strong></span>
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">
                              ⚠️ Paste full YouTube URL (e.g. watch?v=...) or 11-char ID
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 3. Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">3. Description (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Short blurb shown under the video title on public site..."
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* 4 & 5. Featured Toggle & Order */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Featured Toggle */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">4. Featured</label>
                        <div
                          onClick={() => setVideoForm({ ...videoForm, featured: !videoForm.featured })}
                          className={`cursor-pointer px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-colors ${
                            videoForm.featured
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className="flex items-center space-x-1.5">
                            <Star className={`w-3.5 h-3.5 ${videoForm.featured ? 'fill-emerald-400' : ''}`} />
                            <span>{videoForm.featured ? 'Featured First' : 'Standard'}</span>
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            videoForm.featured ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-200 dark:border-slate-700'
                          }`}>
                            {videoForm.featured && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </div>
                      </div>

                      {/* Display Order */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">5. Display Order</label>
                        <input
                          type="number"
                          min={1}
                          value={videoForm.order}
                          onChange={(e) => setVideoForm({ ...videoForm, order: parseInt(e.target.value) || 1 })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* 6. Thumbnail Upload / URL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">6. Thumbnail Image (Optional)</label>
                      <div className="flex items-center space-x-2">
                        <label className="flex-1 cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2">
                          <Upload className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setVideoForm({ ...videoForm, thumbnailUrl: url }))}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-600">OR URL</span>
                      </div>

                      <input
                        type="url"
                        placeholder="https://img.youtube.com/vi/..."
                        value={videoForm.thumbnailUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                      />

                      {/* Thumbnail Preview */}
                      {(videoForm.thumbnailUrl || extractYouTubeVideoId(videoForm.youtubeUrl)) && (
                        <div className="mt-2 h-28 rounded-xl overflow-hidden border border-emerald-500/40 relative bg-white dark:bg-slate-900">
                          <img
                            src={videoForm.thumbnailUrl || getYouTubeThumbnailUrl(extractYouTubeVideoId(videoForm.youtubeUrl) || '')}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                            Thumbnail Preview
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center space-x-2">
                      <button
                        type="submit"
                        disabled={isVideoSaving}
                        className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm shadow-emerald-500/20"
                      >
                        {isVideoSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving Video...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>{isEditingVideo ? 'Update Video' : 'Save Video'}</span>
                          </>
                        )}
                      </button>

                      {extractYouTubeVideoId(videoForm.youtubeUrl) && (
                        <button
                          type="button"
                          onClick={() => setPreviewVideoId(extractYouTubeVideoId(videoForm.youtubeUrl))}
                          className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                        >
                          <Eye className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Right Column: Active Featured Videos List */}
                <div className="lg:col-span-7 space-y-3 max-h-[620px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">
                      Playlist Videos ({featuredVideos.length})
                    </h4>
                    <div className="flex items-center space-x-2">
                      {featuredVideos.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllVideos}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove All Videos</span>
                        </button>
                      )}
                      <span className="text-[11px] text-slate-600 hidden sm:inline">Sorted by Order & Featured</span>
                    </div>
                  </div>

                  {featuredVideos.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-2">
                      <Film className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-medium">No featured videos added yet.</p>
                      <p className="text-[11px] text-slate-600">Fill out the form on the left to add your first video.</p>
                    </div>
                  ) : (
                    [...featuredVideos]
                      .sort((a, b) => {
                        if (a.featured && !b.featured) return -1;
                        if (!a.featured && b.featured) return 1;
                        return (a.order || 0) - (b.order || 0);
                      })
                      .map((video) => (
                        <div
                          key={video.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                        >
                          {/* Left: Thumbnail & Details */}
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shrink-0 group cursor-pointer" onClick={() => setPreviewVideoId(video.videoId)}>
                              <img
                                src={video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoId)}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-emerald-700 dark:text-emerald-400 fill-current" />
                              </div>
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                {video.featured && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>Featured</span>
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                                  Order #{video.order || 1}
                                </span>
                              </div>

                              <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{video.title}</h5>
                              <p className="text-[11px] text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate line-clamp-1">{video.description || 'No description'}</p>
                              <span className="text-[10px] text-slate-600 font-mono">ID: {video.videoId}</span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => setPreviewVideoId(video.videoId)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors"
                              title="Preview Video"
                            >
                              <Play className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditVideo(video)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors"
                              title="Edit Video"
                            >
                              <Edit className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(video.id, video.title)}
                              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white transition-colors"
                              title="Delete Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* VIDEO PREVIEW MODAL */}
            {previewVideoId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-md">
                <div className="max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-md relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Film className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Video Player Preview</h4>
                    </div>
                    <button
                      onClick={() => setPreviewVideoId(null)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1`}
                      title="YouTube Video Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'hero' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add / Update Hero Section Slide Photo</span>
                  </h4>

                  <form onSubmit={handleAddHero} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Slide Title (e.g. Modern Science & Robotics Lab)"
                      value={newHero.title}
                      onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Subtitle / Caption"
                      value={newHero.subtitle}
                      onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                    />

                    <input
                      type="text"
                      placeholder="Tag (e.g. Grade 10 STEM / Champions)"
                      value={newHero.tag}
                      onChange={(e) => setNewHero({ ...newHero, tag: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    {/* Image File Upload & URL Picker */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload Slide Photo</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl cursor-pointer text-xs font-bold text-blue-400">
                          <Cloud className="w-4 h-4" />
                          <span>Cloudinary</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCloudinarySingleUpload(file, (url) => setNewHero(prev => ({ ...prev, image: url })));
                            }}
                            className="hidden"
                          />
                        </label>

                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Local File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setNewHero(prev => ({ ...prev, image: url })))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        placeholder="Image URL (https://...)"
                        value={newHero.image}
                        onChange={(e) => setNewHero(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                      />

                      {newHero.image && (
                        <div className="mt-2 h-24 rounded-xl overflow-hidden border border-emerald-500/50 relative">
                          <img loading="lazy" src={newHero.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewHero(prev => ({ ...prev, image: '' }))}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-50 dark:bg-slate-950/80 text-red-400 hover:text-slate-900 dark:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      Publish Hero Slide Photo
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Active Hero Slides ({heroSlides.length})</h4>
                    {heroSlides.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllHero}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove All Hero Slides</span>
                      </button>
                    )}
                  </div>
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center space-x-4">
                      <img loading="lazy" src={slide.image} alt={slide.title} className="w-24 h-16 rounded-xl object-cover shrink-0 border border-slate-300 dark:border-slate-800" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">{slide.tag}</span>
                        <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{slide.title}</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate">{slide.subtitle}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteHero(slide.id)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: LEADERSHIP PHOTOS MANAGEMENT */}
            {activeTab === 'leadership' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Add / Edit Leadership Member Photo</span>
                  </h4>

                  <form onSubmit={handleAddLeader} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Leader Full Name (e.g. Sr. Beatrice Mwangi)"
                      value={newLeader.name}
                      onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Role (e.g. Principal / Deputy Principal)"
                      value={newLeader.role}
                      onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Academic Title / Qualifications"
                      value={newLeader.title}
                      onChange={(e) => setNewLeader({ ...newLeader, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    {/* Profile Photo Upload */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Photo Upload</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl cursor-pointer text-xs font-bold text-blue-400">
                          <Cloud className="w-4 h-4" />
                          <span>Cloudinary</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCloudinarySingleUpload(file, (url) => setNewLeader(prev => ({ ...prev, imageUrl: url })));
                            }}
                            className="hidden"
                          />
                        </label>

                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Local File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setNewLeader(prev => ({ ...prev, imageUrl: url })))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        placeholder="OR Photo URL"
                        value={newLeader.imageUrl}
                        onChange={(e) => setNewLeader(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                      />

                      {newLeader.imageUrl && (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto relative group">
                          <img loading="lazy" src={newLeader.imageUrl} alt="Leader Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewLeader(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute inset-0 bg-slate-50 dark:bg-slate-950/70 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Photo"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Leadership Quote"
                      value={newLeader.quote}
                      onChange={(e) => setNewLeader({ ...newLeader, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <textarea
                      rows={3}
                      placeholder="Biography / Summary"
                      value={newLeader.bio}
                      onChange={(e) => setNewLeader({ ...newLeader, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      Save Leadership Profile & Photo
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Current Leadership Profiles ({leadership.length})</h4>
                    {leadership.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllLeader}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove All Leadership Profiles</span>
                      </button>
                    )}
                  </div>
                  {leadership.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center space-x-4">
                      <img loading="lazy" src={l.imageUrl} alt={l.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-emerald-500/30 shrink-0" />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">{l.role}</span>
                        <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{l.name}</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate">{l.title}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLeader(l.id)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GALLERY PHOTOS MANAGEMENT WITH CLOUDINARY CDN */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                
                {/* CLOUDINARY BATCH UPLOADER BANNER */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                      <CloudUpload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>Cloudinary Photo Gallery CDN</span>
                        {cloudinaryConfig.cloudName ? (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                            Cloud: {cloudinaryConfig.cloudName}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                            Setup Required
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">Upload single or multiple school photos directly to Cloudinary and publish automatically.</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <label className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl cursor-pointer font-bold text-xs transition-all shadow-sm ${
                      isCloudinaryUploading
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    }`}>
                      {isCloudinaryUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4" />
                          <span>⚡ Batch Upload Photos to Cloudinary</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isCloudinaryUploading}
                        onChange={handleCloudinaryBatchUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCloudinaryConfig(!showCloudinaryConfig)}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
                      title="Cloudinary API Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isCloudinaryUploading && (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center space-x-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="font-semibold">{cloudinaryStatusMsg || 'Uploading photos to Cloudinary...'}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Single Photo Upload Form */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>{editingGalleryItem ? 'Edit Gallery Photo' : 'Upload Single Photo'}</span>
                    </h4>

                    {editingGalleryItem ? (
                      <form onSubmit={handleUpdateGallery} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase">Photo Title</label>
                          <input
                            type="text"
                            required
                            value={editingGalleryItem.title}
                            onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase">Category</label>
                          <select
                            value={editingGalleryItem.category}
                            onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                          >
                            <option value="Academics">Academics</option>
                            <option value="Facilities">Facilities</option>
                            <option value="Sports">Sports</option>
                            <option value="Events">Events</option>
                            <option value="Student Life">Student Life</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase">Image URL (Cloudinary / Link)</label>
                          <input
                            type="url"
                            required
                            value={editingGalleryItem.imageUrl}
                            onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase">Caption</label>
                          <input
                            type="text"
                            value={editingGalleryItem.caption || ''}
                            onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            type="submit"
                            disabled={isGallerySaving}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                          >
                            {isGallerySaving ? 'Saving...' : 'Update Photo Details'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingGalleryItem(null)}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleAddGallery} className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Photo Title (e.g. Modern Chemistry Lab)"
                          value={newGallery.title}
                          onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                        />

                        <select
                          value={newGallery.category}
                          onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                        >
                          <option value="Academics">Academics</option>
                          <option value="Facilities">Facilities</option>
                          <option value="Sports">Sports</option>
                          <option value="Events">Events</option>
                          <option value="Student Life">Student Life</option>
                        </select>

                        {/* Image Upload */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Photo Upload</label>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl cursor-pointer text-xs font-bold text-blue-400">
                              <Cloud className="w-4 h-4" />
                              <span>Cloudinary Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCloudinarySingleUpload(file, (url) => setNewGallery({ ...newGallery, imageUrl: url }));
                                }}
                                className="hidden"
                              />
                            </label>

                            <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                              <Upload className="w-4 h-4" />
                              <span>Local File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setNewGallery({ ...newGallery, imageUrl: url }))}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <input
                            type="url"
                            placeholder="OR Photo Link URL (https://...)"
                            value={newGallery.imageUrl}
                            onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                          />

                          {newGallery.imageUrl && (
                            <div className="mt-2 h-28 rounded-xl overflow-hidden border border-emerald-500/50 relative">
                              <img loading="lazy" src={newGallery.imageUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                              <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">Preview</span>
                            </div>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Caption / Short Description"
                          value={newGallery.caption}
                          onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                        />

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm shadow-emerald-500/20"
                        >
                          Add Photo To Campus Gallery
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Existing Photo List Grid with Edit & Delete */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Published Gallery Photos ({gallery.length})</h4>
                      <div className="flex items-center space-x-2">
                        {gallery.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllGallery}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Wipe All Dummy Photos</span>
                          </button>
                        )}
                        <span className="text-[11px] text-slate-600 hidden sm:inline">Click edit or delete on any photo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
                      {gallery.map((g) => (
                        <div key={g.id} className="relative h-36 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 group bg-slate-50 dark:bg-slate-950">
                          <img loading="lazy" src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/75 p-2 flex flex-col justify-between opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase">{g.category}</span>
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingGalleryItem(g)}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 text-slate-900 dark:text-white"
                                  title="Edit Photo"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGallery(g.id)}
                                  className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                  title="Delete Photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{g.title}</p>
                              {g.caption && <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-[10px] truncate">{g.caption}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BANNERS MANAGEMENT */}
            {activeTab === 'banners' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Promotional Banner Photo</span>
                  </h4>

                  <form onSubmit={handleAddBanner} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Banner Title"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Subtitle"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    {/* Banner Image Upload */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Banner Image Upload</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl cursor-pointer text-xs font-bold text-blue-400">
                          <Cloud className="w-4 h-4" />
                          <span>Cloudinary</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCloudinarySingleUpload(file, (url) => setNewBanner(prev => ({ ...prev, imageUrl: url })));
                            }}
                            className="hidden"
                          />
                        </label>

                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Local File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setNewBanner(prev => ({ ...prev, imageUrl: url })))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        placeholder="OR Image URL"
                        value={newBanner.imageUrl}
                        onChange={(e) => setNewBanner(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                      />

                      {newBanner.imageUrl && (
                        <div className="mt-2 h-20 rounded-xl overflow-hidden border border-emerald-500/50 relative">
                          <img loading="lazy" src={newBanner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewBanner(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-50 dark:bg-slate-950/80 text-red-400 hover:text-slate-900 dark:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      Add Banner Slide
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Promotional Banners ({banners.length})</h4>
                    {banners.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllBanners}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove All Banners</span>
                      </button>
                    )}
                  </div>
                  {banners.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center justify-between space-x-4">
                      <img loading="lazy" src={b.imageUrl} alt={b.title} className="w-20 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold truncate text-slate-900 dark:text-white">{b.title}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate">{b.subtitle}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: NEWS MANAGEMENT */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Post News / Announcement Photo & Article</span>
                  </h4>

                  <form onSubmit={handleAddNews} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Headline / Title"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                    />

                    <select
                      value={newNews.category}
                      onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Events">Events</option>
                      <option value="Sports">Sports</option>
                      <option value="Announcements">Announcements</option>
                      <option value="CBC Updates">CBC Updates</option>
                    </select>

                    {/* News Image Upload */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Featured Image Upload</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl cursor-pointer text-xs font-bold text-blue-400">
                          <Cloud className="w-4 h-4" />
                          <span>Cloudinary</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCloudinarySingleUpload(file, (url) => setNewNews(prev => ({ ...prev, imageUrl: url })));
                            }}
                            className="hidden"
                          />
                        </label>

                        <label className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Local File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setNewNews(prev => ({ ...prev, imageUrl: url })))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        placeholder="OR Image URL"
                        value={newNews.imageUrl}
                        onChange={(e) => setNewNews(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500"
                      />

                      {newNews.imageUrl && (
                        <div className="mt-2 h-20 rounded-xl overflow-hidden border border-emerald-500/50 relative">
                          <img loading="lazy" src={newNews.imageUrl} alt="News Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewNews(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-50 dark:bg-slate-950/80 text-red-400 hover:text-slate-900 dark:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      required
                      placeholder="Short Summary / Excerpt"
                      value={newNews.excerpt}
                      onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <textarea
                      rows={3}
                      required
                      placeholder="Full Article Content"
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      Publish Post To Website
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Current Posts ({news.length})</h4>
                    {news.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllNews}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove All News Posts</span>
                      </button>
                    )}
                  </div>
                  {news.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-4 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">{item.category} • {item.date}</span>
                        <h5 className="text-sm font-bold truncate text-slate-900 dark:text-white">{item.title}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 truncate">{item.excerpt}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: JOBS */}
            {activeTab === 'jobs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Publish Career Opportunity</span>
                  </h4>

                  <form onSubmit={handleAddJob} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Job Title (e.g. Physics Teacher)"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Department"
                      value={newJob.department}
                      onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Deadline (e.g. March 30, 2026)"
                      value={newJob.deadline}
                      onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />

                    <textarea
                      rows={2}
                      required
                      placeholder="Job Description"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <textarea
                      rows={3}
                      required
                      placeholder="Key Requirements (one per line)"
                      value={newJob.requirementsStr}
                      onChange={(e) => setNewJob({ ...newJob, requirementsStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      Post Vacancy
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Open Vacancies ({jobs.length})</h4>
                    {jobs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllJobs}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-slate-900 dark:text-white text-[11px] font-bold transition-colors flex items-center space-x-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove All Job Postings</span>
                      </button>
                    )}
                  </div>
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">{job.department}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-red-400 font-bold">Deadline: {job.deadline}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1 rounded bg-red-600 hover:bg-red-700 text-white ml-2"
                            title="Delete Career Vacancy"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 line-clamp-1">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-500 dark:text-slate-400">Incoming Contact Inquiries ({messages.length})</h4>
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-600">No contact messages received yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{msg.name} ({msg.email} • {msg.phone || 'No Phone'})</span>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">{msg.subject || 'General'}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded bg-red-600 hover:bg-red-700 text-white ml-2"
                            title="Delete Contact Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
