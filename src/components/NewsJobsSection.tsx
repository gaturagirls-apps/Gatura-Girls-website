import React, { useState } from 'react';
import { NewsItem, JobPosting, UsefulLink } from '../types';
import { 
  Newspaper, 
  Briefcase, 
  Calendar, 
  Download, 
  ArrowRight, 
  FileText, 
  Search, 
  CheckCircle,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface NewsJobsSectionProps {
  news: NewsItem[];
  jobs: JobPosting[];
  links: UsefulLink[];
}

export const NewsJobsSection: React.FC<NewsJobsSectionProps> = ({ news, jobs, links }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'jobs' | 'downloads'>('news');
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('All');
  const [newsSearch, setNewsSearch] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);

  const categories = ['All', 'Academics', 'Events', 'Sports', 'Announcements', 'CBC Updates'];

  const filteredNews = (news || []).filter(item => {
    const matchesCat = selectedNewsCategory === 'All' || item.category === selectedNewsCategory;
    const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="news" className="surface-base py-24 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="eyebrow">
              <Newspaper className="w-4 h-4" />
              <span>School Noticeboard & Careers</span>
            </div>
            <h2 className="section-title">
              News, Vacancies & <em>Circulars</em>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl font-light">
              Stay updated with official school announcements, academic circulars, CBC pathway news, and career opportunities.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'news'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>School News ({news.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Careers ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'downloads'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Downloads</span>
            </button>
          </div>
        </div>

        {/* TAB 1: NEWS & ANNOUNCEMENTS */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            
            {/* Search & Category bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNewsCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedNewsCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                >
                  {item.imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {item.category}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.date}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:hover:text-emerald-700 dark:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <button
                        onClick={() => setActiveNewsModal(item)}
                        className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-800 dark:text-emerald-300"
                      >
                        <span>Read Full Post</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {item.attachmentUrl && (
                        <a
                          href={item.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF Attachment</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: CAREER OPPORTUNITIES & JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Join our dynamic teaching & staff faculty at St. Teresa Gatura Girls Senior School. Equal opportunity employer.</span>
            </div>

            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          {job.department}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          {job.employmentType}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                        {job.title}
                      </h3>
                    </div>

                    <div className="text-right sm:text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Application Deadline</p>
                      <p className="text-sm font-bold text-red-500 dark:text-red-400">{job.deadline}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    {job.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Minimum Key Requirements:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-800 dark:text-slate-200">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-700/60">
                    <p className="text-xs text-slate-600">
                      Submit applications to: <strong className="text-emerald-600 dark:text-emerald-400">jobs@stteresagaturagirls.sc.ke</strong>
                    </p>

                    <a
                      href="mailto:jobs@stteresagaturagirls.sc.ke"
                      className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-all"
                    >
                      <span>Apply via Email</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOWNLOADS & CIRCULARS */}
        {activeTab === 'downloads' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      {link.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {link.title}
                    </h4>
                  </div>
                </div>

                <a
                  href={link.url}
                  onClick={(e) => {
                    if (link.url === '#') {
                      e.preventDefault();
                      alert('Document preview: Downloading official PDF circular from St. Teresa Gatura Girls.');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-300 hover:text-slate-950 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* News Full Detail Modal */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-emerald-500/30 shadow-md space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                {activeNewsModal.category}
              </span>
              <button
                onClick={() => setActiveNewsModal(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm"
              >
                Close ✕
              </button>
            </div>

            {activeNewsModal.imageUrl && (
              <img
                src={activeNewsModal.imageUrl}
                alt={activeNewsModal.title}
                className="w-full h-64 object-cover rounded-2xl border border-slate-300 dark:border-slate-800"
              />
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{activeNewsModal.date}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeNewsModal.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {activeNewsModal.content}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-300 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveNewsModal(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
