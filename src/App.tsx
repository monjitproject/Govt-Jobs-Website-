/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Briefcase, FileText, Award, Building, Train, 
  Shield, BookOpen, GraduationCap, MapPin, Map, Bell, Star, 
  AlertCircle, Share2, ArrowRight, Table, ChevronRight, Clock, 
  Info, CheckCircle, Flame, Calendar, Sparkles, AlertTriangle, 
  RefreshCw, BookmarkCheck, ArrowUpRight, HelpCircle
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import AdBar from './components/AdBar';
import JobView from './components/JobView';
import AdminPanel from './components/AdminPanel';
import BookmarkedJobs from './components/BookmarkedJobs';
import AdsensePages from './components/AdsensePages';
import { JobPost, AdmitCard, JobResult, Advertisement, CategoryType } from './types';
import { STATES_LIST, QUALIFICATIONS_LIST, DEPARTMENTS_LIST, CATEGORIES } from './data';

export default function App() {
  // Navigation Routing States
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Storage dataset states (Fetched from express server api)
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [admits, setAdmits] = useState<AdmitCard[]>([]);
  const [results, setResults] = useState<JobResult[]>([]);
  const [adsList, setAdsList] = useState<Advertisement[]>([]);
  
  // Interaction/UI states
  const [savedJobs, setSavedJobs] = useState<JobPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | ''>('');
  
  // Theme Toggle state
  const [dark, setDark] = useState(false);

  // Modals overlays
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Loading/Refresh trackers
  const [dataLoading, setDataLoading] = useState(true);

  // 1. Detect and parse current routing paths on load / user popstate clicks
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation trigger
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Fetch and synchronize remote listings from our backend server database
  const loadPlatformData = async () => {
    setDataLoading(true);
    try {
      // Parallel REST load
      const [jobsRes, admitsRes, resultsRes, adsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/admits'),
        fetch('/api/results'),
        fetch('/api/ads')
      ]);

      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (admitsRes.ok) setAdmits(await admitsRes.json());
      if (resultsRes.ok) setResults(await resultsRes.json());
      if (adsRes.ok) setAdsList(await adsRes.json());
    } catch (err) {
      console.warn("Express server database not reachable. Operating on internal state fallbacks.", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
    
    // Load bookmarks index cache
    try {
      const cached = localStorage.getItem('sarkari_bookmarks');
      if (cached) {
        setSavedJobs(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Storage limits blocked bookmarks restoration", e);
    }

    // Restore dark/light configuration state
    try {
      const mode = localStorage.getItem('sarkari_theme_dark');
      if (mode === 'true') {
        setDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  // 3. Coordinate Dark / Light theme propagation
  const handleToggleTheme = () => {
    const toggled = !dark;
    setDark(toggled);
    if (toggled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sarkari_theme_dark', toggled.toString());
  };

  // 4. Bookmark handlers
  const handleToggleBookmark = (job: JobPost) => {
    let updated: JobPost[] = [];
    const exists = savedJobs.some(j => j.id === job.id);
    if (exists) {
      updated = savedJobs.filter(j => j.id !== job.id);
    } else {
      updated = [job, ...savedJobs];
    }
    setSavedJobs(updated);
    localStorage.setItem('sarkari_bookmarks', JSON.stringify(updated));
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = savedJobs.filter(j => j.id !== id);
    setSavedJobs(updated);
    localStorage.setItem('sarkari_bookmarks', JSON.stringify(updated));
  };

  // 5. Backend notification increment tracker
  const handleRecordDownload = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/download`, { method: 'POST' });
    } catch {}
  };

  // 6. Filtering Logic calculation matrices
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // Search matching titles / description
      const matchesSearch = searchQuery
        ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // State matching
      const matchesState = selectedState === 'All India' 
        ? true 
        : job.state.toLowerCase() === selectedState.toLowerCase();

      // Qualification matching
      const matchesQual = selectedQualification
        ? job.qualification.toLowerCase() === selectedQualification.toLowerCase()
        : true;

      // Department matching
      const matchesDept = selectedDepartment
        ? job.department.toLowerCase() === selectedDepartment.toLowerCase()
        : true;

      // Category matching
      let matchesCat = true;
      if (selectedCategory) {
        matchesCat = job.category === selectedCategory;
      }

      // If viewing category route page
      if (currentPath.startsWith('/category/')) {
        const routeCat = currentPath.replace('/category/', '');
        if (routeCat && routeCat !== 'latest-job' && routeCat !== 'admission' && routeCat !== 'scholarship' && routeCat !== 'important-update' && routeCat !== 'admit-card' && routeCat !== 'result' && routeCat !== 'answer-key' && routeCat !== 'syllabus') {
          matchesCat = job.category === routeCat;
        }
      }

      return matchesSearch && matchesState && matchesQual && matchesDept && matchesCat;
    });
  };

  // Reset all filters safely
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('All India');
    setSelectedQualification('');
    setSelectedDepartment('');
    setSelectedCategory('');
  };

  const filteredJobs = getFilteredJobs();

  // Route matches checking
  const isJobViewRoute = currentPath.startsWith('/jobs/');
  const activeJobSlug = isJobViewRoute ? currentPath.replace('/jobs/', '') : null;
  const activeJob = activeJobSlug ? jobs.find(j => j.slug === activeJobSlug) : null;

  // Render core router panels
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      
      {/* AD BLOCK: HEADER POSITION */}
      <AdBar location="header" adsList={adsList} />

      {/* Global Header */}
      <Header 
        currentPath={currentPath}
        onNavigate={navigateTo}
        onSearch={(q) => { setSearchQuery(q); navigateTo('/'); }}
        dark={dark}
        onToggleTheme={handleToggleTheme}
        savedJobsCount={savedJobs.length}
        onOpenSavedModal={() => setIsSavedOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />

      {/* Primary Container space */}
      <main className="pb-16 min-h-[70vh]">
        
        {/* Dynamic routing render: Legal, Support, Compliance, Privacy forms */}
        {['/about', '/contact', '/policy/privacy', '/policy/terms', '/policy/disclaimer', '/policy/dmca', '/policy/editorial', '/policy/cookie'].includes(currentPath) ? (
          <AdsensePages pagePath={currentPath} onNavigate={navigateTo} />
        ) : isJobViewRoute ? (
          // Dynamic Job Posting Detail file view
          activeJob ? (
            <JobView 
              job={activeJob}
              relatedJobs={jobs.filter(j => j.category === activeJob.category && j.id !== activeJob.id).slice(0, 3)}
              isBookmarked={savedJobs.some(s => s.id === activeJob.id)}
              onToggleBookmark={() => handleToggleBookmark(activeJob)}
              onNavigate={navigateTo}
              onDownloadPdf={handleRecordDownload}
              adsList={adsList}
            />
          ) : (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto space-y-4">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <h3 className="font-display text-xl font-bold dark:text-white">Notification Alert Not Synchronized</h3>
                <p className="text-xs text-gray-500">The referenced job page slug doesn&apos;t match any active listings in our database.</p>
                <button onClick={() => navigateTo('/')} className="px-5 py-2.5 bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-md">
                  Return to Dashboard
                </button>
              </div>
            </div>
          )
        ) : (
          // DEFAULT CORE HOMEPAGE
          <div id="homepage-main-canvas" className="space-y-8">
            
            {/* A. Hero Banner Section */}
            <section className="bg-gradient-to-r from-brand-900 via-brand-850 to-brand-600 border-b border-slate-205 py-12 px-4 md:px-8 relative overflow-hidden select-none">
              {/* Geometric space outlines background (High Density style) */}
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none">
                <svg width="400" height="400" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none"/>
                  <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1" fill="none"/>
                  <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.5" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-brand-100 rounded-full text-[10px] md:text-xs font-bold border border-white/20 shadow-sm uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PREMIUM SARKARI CAREER PORTAL</span>
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Find Confirmed Indian <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-amber-300">Government Opportunities</span>
                  </h2>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-90">
                    Skip dense web traps and confusing forms. Browse verified central department notices, syllabus patterns, latest admit cards and official result releases with built-in instant PDF previews.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <button 
                      onClick={() => navigateTo('/category/latest-job')}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer border border-brand-500/20"
                    >
                      Explore Latest Jobs
                    </button>
                    <button 
                      onClick={() => navigateTo('/about')}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-sm"
                    >
                      About Our Portal
                    </button>
                  </div>
                </div>

                {/* Right Side Info grid metrics */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-md">
                    <Flame className="w-5 h-5 text-amber-405" />
                    <h4 className="font-mono text-xl font-bold mt-1.5 text-white">100%</h4>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Government Verified</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-md">
                    <Building className="w-5 h-5 text-cyan-405" />
                    <h4 className="font-mono text-xl font-bold mt-1.5 text-white">17K+</h4>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Active Notifications</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-md">
                    <FileText className="w-5 h-5 text-rose-405" />
                    <h4 className="font-mono text-xl font-bold mt-1.5 text-white">Daily</h4>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">PDF Updates Published</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-md">
                    <Clock className="w-5 h-5 text-brand-300" />
                    <h4 className="font-mono text-xl font-bold mt-1.5 text-white">Secured</h4>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">SSL Sandboxed Previews</p>
                  </div>
                </div>
              </div>
            </section>

            {/* B. Filter and Search panel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
                
                <h3 className="font-display text-lg font-bold text-slate-905 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-500 animate-pulse" />
                  <span>Interactive Search & Filtration System</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Search input */}
                  <div className="relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Quick Search</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g. UPSC, Assistant, Army"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 rounded-xl dark:text-white"
                      />
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                  {/* State selection */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">State Wise Job</label>
                    <select 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 rounded-xl dark:text-white"
                    >
                      <option value="All India">All Over India</option>
                      {STATES_LIST.filter(s => s !== "All India").map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Qualifications selection */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Academic stream</label>
                    <select 
                      value={selectedQualification}
                      onChange={(e) => setSelectedQualification(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 rounded-xl dark:text-white"
                    >
                      <option value="">All Qualifications</option>
                      {QUALIFICATIONS_LIST.map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department selection */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Organizing Board</label>
                    <select 
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 rounded-xl dark:text-white"
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS_LIST.map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categories filtering tabs */}
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-slate-800 pt-4">
                  <span className="text-[10px] font-bold uppercase text-slate-450 mr-2 shrink-0">Sub Division:</span>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${!selectedCategory ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.slice(0, 10).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${selectedCategory === cat.slug ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Filter logs status clear button */}
                {(searchQuery || selectedState !== 'All India' || selectedQualification || selectedDepartment || selectedCategory) && (
                  <div className="flex items-center justify-between bg-brand-50/20 dark:bg-slate-950 p-3 rounded-xl border border-brand-100 dark:border-slate-800">
                    <span className="text-xs text-slate-650 dark:text-slate-400">
                      ✓ Filters matches active: <strong className="text-slate-850 dark:text-white font-mono">{filteredJobs.length} Alerts</strong>
                    </span>
                    <button 
                      onClick={handleClearFilters}
                      className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 shrink-0"
                    >
                      Clear Search Parameters
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* C. Primary Jobs Portal Alert List */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Jobs notifications block (2 columns) */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5.5 h-5.5 text-brand-600" />
                    <span>Latest Sarkari Job Alerts ({filteredJobs.length})</span>
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 select-none">
                    <span>⚡ Daily Index Updates</span>
                  </div>
                </div>

                {dataLoading ? (
                  // Skeleton placeholders
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border animate-pulse space-y-3">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded" />
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-150 shadow-inner">
                    <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-bounce" />
                    <p className="font-sans font-bold text-slate-800 dark:text-white">No active matches found matching the configured search filters.</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Please clear customized state tags or check alternate academic qualifications select items.</p>
                    <button onClick={handleClearFilters} className="mt-4 px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-lg shadow">
                      Reset Filter Criteria
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredJobs.map((job) => (
                      <div 
                        key={job.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col md:flex-row justify-between gap-3 items-start"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span className="px-2 py-0.5 bg-slate-900 text-white dark:bg-slate-800 dark:text-brand-300 rounded font-black uppercase">
                              {job.orgName}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-950 text-gray-500 rounded font-semibold whitespace-nowrap">
                              📍 {job.state}
                            </span>
                            <span className="px-2 py-0.5 bg-brand-50 text-brand-700 dark:bg-slate-950 dark:text-brand-300 rounded font-bold whitespace-nowrap">
                              🎓 {job.qualification}
                            </span>
                          </div>

                          <h4 
                            onClick={() => navigateTo(`/jobs/${job.slug}`)}
                            className="font-display font-extrabold text-sm md:text-base text-slate-900 dark:text-white mt-2 group-hover:text-brand-650 cursor-pointer transition-colors leading-snug hover:underline pr-4"
                          >
                            {job.title}
                          </h4>

                          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mt-1 font-sans line-clamp-2">
                            {job.shortDescription}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] md:text-xs text-gray-400 dark:text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-rose-500" />
                              <span>Expiry: <strong className="text-red-500">{job.lastDate}</strong></span>
                            </span>
                            <span>•</span>
                            <span>Views: {job.views}</span>
                            <span>•</span>
                            <span>Downloads: {job.downloads}</span>
                          </div>
                        </div>

                        {/* Direct action links */}
                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-slate-850 pt-2 md:pt-0 shrink-0">
                          <div className="hidden md:block">
                            <button 
                              onClick={() => handleToggleBookmark(job)}
                              className="p-1 px-2 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 text-gray-400 rounded-lg"
                              title="Bookmark post"
                            >
                              {savedJobs.some(s => s.id === job.id) ? (
                                <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <button 
                            onClick={() => navigateTo(`/jobs/${job.slug}`)}
                            className="mt-1 md:mt-4 inline-flex items-center gap-1 font-display font-bold text-xs bg-slate-50 dark:bg-slate-950 dark:hover:bg-brand-600 text-slate-850 dark:text-slate-300 px-3.5 py-1.5 rounded-lg group-hover:bg-brand-600 group-hover:text-white border border-gray-150 dark:border-slate-800 shadow-sm"
                          >
                            <span>Read Alert</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar content lists (Admit cards and Results) */}
              <div className="space-y-5">
                
                {/* 1. Recent Admit Cards Widget */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col select-none">
                  <div className="bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 border-b border-gray-150 dark:border-slate-850 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-amber-850 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      <span>Admit Cards</span>
                    </h3>
                    <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-mono">NEW</span>
                  </div>

                  <div className="p-2 flex flex-col overflow-y-auto">
                    {admits.slice(0, 4).map((ad) => (
                      <a 
                        key={ad.id} 
                        href={ad.admitCardUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-950/50 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border-b border-dashed border-gray-200 dark:border-slate-800 last:border-0 block leading-tight hover:text-brand-600"
                      >
                        <span className="text-[9px] text-gray-400 uppercase font-mono block mb-0.5">Released: {ad.releaseDate}</span>
                        🎫 {ad.title}
                      </a>
                    ))}
                    {admits.length === 0 && <p className="text-xs text-gray-400 p-4 text-center">No admit cards released today.</p>}
                  </div>
                </div>

                {/* 2. Sarkari Results Section */}
                <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col select-none">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2.5 border-b border-gray-150 dark:border-slate-850 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Sarkari Result</span>
                    </h3>
                    <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">LIVE</span>
                  </div>

                  <div className="p-2 flex flex-col overflow-y-auto">
                    {results.slice(0, 4).map((res) => (
                      <a 
                        key={res.id} 
                        href={res.officialResultUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-950/50 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border-b border-dashed border-gray-200 dark:border-slate-800 last:border-0 block leading-tight hover:text-brand-600"
                      >
                        <span className="text-[9px] text-gray-400 uppercase font-mono block mb-0.5">Announced: {res.releaseDate}</span>
                        🏆 {res.title}
                      </a>
                    ))}
                    {results.length === 0 && <p className="text-xs text-gray-400 p-4 text-center">No results declaring today.</p>}
                  </div>
                </div>

                {/* 3. Competitive Exams Countdown */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl select-none">
                  {/* Absolute subtle clock widget branding */}
                  <div className="absolute right-2 bottom-2 text-white/5 font-display text-8xl font-black leading-none pointer-events-none">
                    26/27
                  </div>

                  <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    🎯 Exam Calendar Countdown
                  </h3>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">UP Constable Exams:</span>
                      <span className="text-amber-400 font-bold font-mono">Starts in 68 Days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">UPSC CSE Prelims 2026:</span>
                      <span className="text-amber-400 font-bold font-mono">Starts in 107 Days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SSC CGL Tier-1 Batch:</span>
                      <span className="text-brand-400 font-bold font-mono">Starts October 2026</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}
      </main>

      {/* Embedded Admin console dashboard modal */}
      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)}
          jobs={jobs}
          onRefreshData={loadPlatformData}
          adsList={adsList}
          onUpdateAds={(updated) => setAdsList(updated)}
        />
      )}

      {/* Embedded Bookmarks overlay panel drawer */}
      {isSavedOpen && (
        <BookmarkedJobs 
          onClose={() => setIsSavedOpen(false)}
          savedJobs={savedJobs}
          onRemoveBookmark={handleRemoveBookmark}
          onNavigate={navigateTo}
        />
      )}

      {/* AD BLOCK: FOOTER POSITION */}
      <AdBar location="footer" adsList={adsList} />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}
