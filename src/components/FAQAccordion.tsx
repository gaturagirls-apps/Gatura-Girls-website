import React, { useState, useMemo } from 'react';
import { FAQItem, PathwayName } from '../types';
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  FlaskConical,
  Compass,
  Search,
  Sparkles,
  Table as TableIcon,
  LayoutGrid,
  Award,
  ArrowRight,
  X,
  Calculator,
  Users
} from 'lucide-react';
import {
  APPROVED_COMBINATIONS,
  PATHWAY_METADATA,
  CORE_FOUNDATION_SUBJECTS
} from '../data/approvedPathways';

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');

  // Pathways & Subject Combinations state
  const [selectedPathway, setSelectedPathway] = useState<PathwayName | 'ALL'>('ALL');
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const faqCategories = ['All', 'General', 'Admissions', 'Academics', 'Boarding & Facilities'];

  const filteredFaqs = selectedFaqCategory === 'All'
    ? faqs
    : (faqs || []).filter(f => f.category === selectedFaqCategory);

  const toggleFAQ = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Compute available tracks based on selected pathway
  const availableTracks = useMemo(() => {
    const tracks = new Set<string>();
    const list = selectedPathway === 'ALL'
      ? APPROVED_COMBINATIONS
      : APPROVED_COMBINATIONS.filter(c => c.pathway === selectedPathway);
    list.forEach(c => tracks.add(c.track));
    return ['ALL', ...Array.from(tracks)];
  }, [selectedPathway]);

  // Filter approved combinations
  const filteredCombinations = useMemo(() => {
    return APPROVED_COMBINATIONS.filter(combo => {
      // Pathway filter
      if (selectedPathway !== 'ALL' && combo.pathway !== selectedPathway) {
        return false;
      }
      // Track filter
      if (selectedTrack !== 'ALL' && combo.track !== selectedTrack) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const codeMatch = combo.code.toLowerCase().includes(query);
        const pathwayMatch = combo.pathway.toLowerCase().includes(query);
        const trackMatch = combo.track.toLowerCase().includes(query);
        const subjectMatch = combo.subjects.some(s => s.toLowerCase().includes(query));
        const careerMatch = combo.recommendedCareers?.toLowerCase().includes(query) ?? false;
        return codeMatch || pathwayMatch || trackMatch || subjectMatch || careerMatch;
      }
      return true;
    });
  }, [selectedPathway, selectedTrack, searchQuery]);

  // Counts for tabs
  const stemCount = APPROVED_COMBINATIONS.filter(c => c.pathway === 'STEM').length;
  const socialCount = APPROVED_COMBINATIONS.filter(c => c.pathway === 'SOCIAL SCIENCES').length;
  const pathwayCount = Object.keys(PATHWAY_METADATA).length;

  const handleApplyCombo = (_code: string) => {
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="surface-base py-24 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================== */}
        {/* SECTION 1: ABOUT ST. TERESA GATURA & DUAL SYSTEM OVERVIEW */}
        {/* ======================================================== */}
        <div className="mb-20 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="eyebrow">
              <BookOpen className="w-4 h-4" />
              <span>Academic Curriculum & Senior Secondary</span>
            </div>
            <h2 className="section-title">
              A Beacon of Girls' <em>Education</em> in Kenya
            </h2>
            <span className="section-rule" aria-hidden="true" />
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              Founded on Christian foundation principles, St. Teresa Gatura Girls Senior School provides a transformative academic environment where young women excel in sciences, humanities, leadership, and moral discipline.
            </p>
          </div>

          {/* CBC Senior Secondary Curriculum Framework Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: 3 Approved CBC Pathways */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-emerald-500/30 dark:border-emerald-500/40 shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-700 dark:bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-bl-xl shadow-sm">
                Grade 10–12 CBC Accredited
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">CBC Senior Secondary Pathways</h3>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{pathwayCount} Approved Pathways • {APPROVED_COMBINATIONS.length} Combinations</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Nationally accredited senior secondary curriculum equipping girls with specialized investigation skills, career pathways, and academic excellence:
              </p>

              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>STEM Pathway:</strong> {stemCount} Approved Pure Sciences & Applied Sciences combinations, taking <strong>Advanced Mathematics</strong>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Social Sciences Pathway:</strong> {socialCount} Approved Humanities, Business Studies & Languages combinations, taking <strong>Essential Mathematics</strong>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Specialized modern laboratories, Computer Hub, and teacher mentorship preparing girls for university degrees.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Compulsory Core Foundation Subjects & Values */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Core Foundation & Holistic Development</h3>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Compulsory Subjects & Life Competencies</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Every Grade 10–12 learner completes national core foundation subjects that foster ethical leadership, digital literacy, and civic responsibility:
              </p>

              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Mathematics & Languages:</strong> Mathematics (Advanced for STEM, Essential for Social Sciences), English, Kiswahili.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Literacy & Technology:</strong> ICT competencies and hands-on digital research.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Physical Health & Service:</strong> Physical Education (PE) and Community Service Learning (CSL).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Strong Christian moral grounding, leadership opportunities, and nurturing personal talents.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 2: OFFICIAL APPROVED SUBJECT COMBINATIONS TABLE   */}
        {/* ======================================================== */}
        <div id="pathways" className="mb-24 scroll-mt-24">
          
          {/* Header & Official Accreditation Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official KICD & Ministry of Education Approval Status</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Approved Senior Secondary Subject Combinations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-light">
                  St. Teresa Gatura Girls Senior School has been accredited by the Ministry of Education for Grade 10 CBC placement. Below is our complete catalog of approved subject combinations.
                </p>
              </div>

              {/* Accreditation Stats Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{pathwayCount}</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Pathways</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
                  <p className="text-xl font-black text-blue-700 dark:text-blue-400">{APPROVED_COMBINATIONS.length}</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Combinations</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">100%</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Approved</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
                  <p className="text-xl font-black text-purple-700 dark:text-purple-400">6</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Core Subjects</p>
                </div>
              </div>
            </div>

            {/* Core Foundation Ribbon */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Compulsory Core Subjects (Taken alongside any approved 3-subject combination)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Total curriculum: 6 Core + 3 Pathway Subjects = 9 Subjects
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CORE_FOUNDATION_SUBJECTS.map((subj) => (
                  <span
                    key={subj.code}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{subj.name}</span>
                  </span>
                ))}
              </div>

              {/* Mathematics is taken at the level of the chosen pathway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(Object.values(PATHWAY_METADATA)).map((meta) => (
                  <div
                    key={meta.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 ${meta.accentBg} ${meta.borderColor}`}
                  >
                    <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-slate-700 dark:text-slate-200" />
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">{meta.mathematics}</strong>
                      {' '}for the <strong>{meta.shortName}</strong> pathway.
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                After the core subjects, each learner chooses <strong>3 subjects</strong> from the combinations approved for her pathway.
              </p>
            </div>

            {/* Filter and View Controls Toolbar */}
            <div className="space-y-4 pt-2">
              
              {/* Primary Pathway Selector Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                  <button
                    onClick={() => { setSelectedPathway('ALL'); setSelectedTrack('ALL'); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPathway === 'ALL'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    All Pathways ({APPROVED_COMBINATIONS.length})
                  </button>
                  <button
                    onClick={() => { setSelectedPathway('STEM'); setSelectedTrack('ALL'); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      selectedPathway === 'STEM'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>STEM ({stemCount})</span>
                  </button>
                  <button
                    onClick={() => { setSelectedPathway('SOCIAL SCIENCES'); setSelectedTrack('ALL'); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      selectedPathway === 'SOCIAL SCIENCES'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Social Sciences ({socialCount})</span>
                  </button>
                </div>

                {/* View Switcher: Table vs Cards */}
                <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                  <button
                    onClick={() => setViewMode('table')}
                    aria-label="Table view"
                    className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Official Table View"
                  >
                    <TableIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Table View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    aria-label="Cards view"
                    className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Cards Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Cards View</span>
                  </button>
                </div>
              </div>

              {/* Sub-Filters: Track + Live Search */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Track selector */}
                <div className="sm:col-span-5 flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0">
                    Track:
                  </span>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableTracks.map((tr) => (
                      <option key={tr} value={tr}>
                        {tr === 'ALL' ? 'All Tracks in View' : tr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="sm:col-span-7 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by subject or code (e.g. Physics, French, ST1048, SS2008)..."
                    className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* RESULTS COUNT & ACTIVE FILTER BADGE */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span>Displaying <strong>{filteredCombinations.length}</strong> of {APPROVED_COMBINATIONS.length} approved combinations</span>
                {(selectedPathway !== 'ALL' || selectedTrack !== 'ALL' || searchQuery) && (
                  <button
                    onClick={() => { setSelectedPathway('ALL'); setSelectedTrack('ALL'); setSearchQuery(''); }}
                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold text-xs"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All listed combinations are accredited</span>
              </div>
            </div>

            {/* ============================================== */}
            {/* VIEW A: OFFICIAL TABLE VIEW                     */}
            {/* ============================================== */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 uppercase font-black tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-bold">Pathway</th>
                      <th className="py-3.5 px-4 font-bold">Track</th>
                      <th className="py-3.5 px-4 font-bold">Subject Combination</th>
                      <th className="py-3.5 px-4 font-bold text-center">Code</th>
                      <th className="py-3.5 px-4 font-bold text-center">Status</th>
                      <th className="py-3.5 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredCombinations.map((combo) => {
                      const isStem = combo.pathway === 'STEM';
                      const maths = PATHWAY_METADATA[combo.pathway].mathematics;

                      return (
                        <tr
                          key={combo.code}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          {/* Pathway Column */}
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                isStem
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300'
                              }`}
                            >
                              {combo.pathway}
                            </span>
                          </td>

                          {/* Track Column */}
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                              {combo.track}
                            </span>
                          </td>

                          {/* Subjects Column */}
                          <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 font-medium">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                <Calculator className="w-3 h-3" />
                                {maths}
                              </span>
                              {combo.subjects.map((subj, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold"
                                >
                                  {subj}
                                </span>
                              ))}
                            </div>
                            {combo.recommendedCareers && (
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none">
                                Leads to: {combo.recommendedCareers}
                              </p>
                            )}
                          </td>

                          {/* Code Column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-400 border border-slate-300 dark:border-slate-700">
                              {combo.code}
                            </span>
                          </td>

                          {/* Status Column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{combo.status}</span>
                            </span>
                          </td>

                          {/* Action Column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleApplyCombo(combo.code)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all hover:scale-105"
                              title={`Inquire about combination ${combo.code}`}
                            >
                              <span>Inquire</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ============================================== */}
            {/* VIEW B: CARDS GRID VIEW                         */}
            {/* ============================================== */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCombinations.map((combo) => {
                  const isStem = combo.pathway === 'STEM';
                  const maths = PATHWAY_METADATA[combo.pathway].mathematics;

                  const borderColor = isStem 
                    ? 'border-emerald-500/30 hover:border-emerald-500' 
                    : 'border-blue-500/30 hover:border-blue-500';

                  const badgeColor = isStem
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300';

                  return (
                    <div
                      key={combo.code}
                      className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border ${borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-3">
                        {/* Top row: Code + Status */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-400 border border-slate-300 dark:border-slate-700">
                            {combo.code}
                          </span>
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{combo.status}</span>
                          </span>
                        </div>

                        {/* Pathway + Track */}
                        <div>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeColor}`}>
                            {combo.pathway}
                          </span>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono mt-1">
                            Track: {combo.track}
                          </p>
                          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <Calculator className="w-3 h-3" />
                            {maths} (core)
                          </p>
                        </div>

                        {/* Subject chips */}
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Choose 3 Subjects:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {combo.subjects.map((subj, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                              >
                                {subj}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Career guidance */}
                        {combo.recommendedCareers && (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Career Targets:</span> {combo.recommendedCareers}
                          </div>
                        )}
                      </div>

                      {/* Inquire button */}
                      <button
                        onClick={() => handleApplyCombo(combo.code)}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white dark:bg-slate-800 dark:hover:bg-emerald-600 font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>Inquire for Combination {combo.code}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredCombinations.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Search className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching approved combinations found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for a different subject (e.g. "Physics", "Computer Studies", "French") or reset the pathway and track filters.
                </p>
                <button
                  onClick={() => { setSelectedPathway('ALL'); setSelectedTrack('ALL'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Reset all filters
                </button>
              </div>
            )}

          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 3: FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION     */}
        {/* ======================================================== */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
          
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Admissions & General Enquiries</h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFaqCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};