/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building, LayoutDashboard, FileText, Settings, Key, 
  Trash2, Plus, LogOut, CheckCircle, Upload, AlertTriangle, 
  Eye, Download, Users, Inbox, ArrowRight, ShieldCheck, Mail, Calendar 
} from 'lucide-react';
import { JobPost, AdmitCard, JobResult, Advertisement, CategoryType } from '../types';
import { STATES_LIST, QUALIFICATIONS_LIST, DEPARTMENTS_LIST, CATEGORIES } from '../data';

interface AdminPanelProps {
  onClose: () => void;
  jobs: JobPost[];
  onRefreshData: () => void;
  adsList: Advertisement[];
  onUpdateAds: (newAds: Advertisement[]) => void;
}

export default function AdminPanel({ onClose, jobs, onRefreshData, adsList, onUpdateAds }: AdminPanelProps) {
  // Authentication State
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'stats' | 'create-post' | 'all-posts' | 'banners' | 'subscribers' | 'inbox'>('stats');

  // Stats Counters state
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalAdmitCards: 0,
    totalResults: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalSubscribers: 0
  });

  // Subscribers & Contacts Lists state
  const [subs, setSubs] = useState<any[]>([]);
  const [contactMsgs, setContactMsgs] = useState<any[]>([]);

  // Job Creation form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>('latest-job');
  const [tags, setTags] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS_LIST[0]);
  const [state, setState] = useState(STATES_LIST[0]);
  const [qualification, setQualification] = useState(QUALIFICATIONS_LIST[0]);
  const [orgName, setOrgName] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [lastDate, setLastDate] = useState('');
  
  // Custom metadata arrays (Dates, Fees, Links)
  const [datesStr, setDatesStr] = useState('Notification Released:2026-06-01,Apply online starts:2026-06-05,Closing Date:2026-07-15');
  const [feesStr, setFeesStr] = useState('General/OBC/EWS:₹100,SC/ST/PH:₹0');
  const [linksStr, setLinksStr] = useState('Apply Online OTR:https://upsconline.nic.in,Official Portal:https://upsc.gov.in');

  // PDF upload / select
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileUrl, setPdfFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Status logs
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Editable local ads
  const [localAds, setLocalAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    setLocalAds(adsList);
  }, [adsList]);

  // Handle password submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin.hub') {
      setIsAuthorized(true);
      setAuthError('');
      fetchAdminStatsAndLogs();
    } else {
      setAuthError('Unauthorized Password passcode. Hint: Use admin123');
    }
  };

  // Fetch log statistics and newsletter registrations
  const fetchAdminStatsAndLogs = async () => {
    try {
      // 1. Fetch statistics calculations
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch newsletter list
      const subsRes = await fetch('/api/newsletters');
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubs(subsData);
      }

      // 3. Fetch inbox records
      const msgsRes = await fetch('/api/contacts');
      if (msgsRes.ok) {
        const msgsData = await msgsRes.json();
        setContactMsgs(msgsData);
      }
    } catch (err) {
      console.warn("Failed loading stats listings", err);
    }
  };

  // Handle PDF Drag & Drop and manual file converter
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrMsg('Standard PDF security formats permitted only.');
      return;
    }

    setIsUploading(true);
    setErrMsg('');
    setSuccessMsg('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileContent: base64Content
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setPdfFileUrl(data.url);
          setPdfFileName(file.name);
          setSuccessMsg(`PDF file uploaded successfully! Serve path: ${data.url}`);
        } else {
          setErrMsg(data.error || 'Server rejected file upload payload.');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
      setErrMsg('Error compiling PDF payload stream.');
    }
  };

  // Build Slug on-the-fly dynamically
  useEffect(() => {
    if (title) {
      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(cleanSlug);
    }
  }, [title]);

  // Dispatch brand-new post creation matching schema relational structure
  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !shortDescription) {
      setErrMsg('Please enter at least title, auto slug, and short description.');
      return;
    }

    // Unpack important dates
    const parsedDates = datesStr.split(',').map(pair => {
      const parts = pair.split(':');
      return { event: parts[0]?.trim() || '', date: parts[1]?.trim() || '' };
    }).filter(d => d.event);

    // Unpack fees
    const parsedFees = feesStr.split(',').map(pair => {
      const parts = pair.split(':');
      return { category: parts[0]?.trim() || '', amount: parts[1]?.trim() || '' };
    }).filter(f => f.category);

    // Unpack links
    const parsedLinks = linksStr.split(',').map(pair => {
      const parts = pair.split(':');
      return { label: parts[0]?.trim() || '', url: parts.slice(1).join(':')?.trim() || '#', isExternal: true };
    }).filter(l => l.label);

    const postPayload = {
      title,
      slug,
      shortDescription,
      content: content || `## Overview\nDetailed notification elements concerning ${title}.`,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      department,
      state,
      qualification,
      orgName: orgName || 'BOARD',
      experience,
      lastDate,
      importantDates: parsedDates,
      applicationFees: parsedFees,
      importantLinks: parsedLinks,
      pdfUrl: pdfFileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      if (res.ok) {
        setSuccessMsg(`Successfully created notification alert: /jobs/${slug}`);
        setErrMsg('');
        setTitle('');
        setShortDescription('');
        setContent('');
        setTags('');
        setOrgName('');
        setPdfFileUrl('');
        setPdfFileName('');
        onRefreshData();
        fetchAdminStatsAndLogs();
      } else {
        const d = await res.json();
        setErrMsg(d.error || 'Connection broken.');
      }
    } catch {
      setErrMsg('Database storage API is offline.');
    }
  };

  // Delete Job Post Alert
  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Delete this notification forever? This operation is irreversible.')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Successfully deleted posting alert.');
        onRefreshData();
        fetchAdminStatsAndLogs();
      }
    } catch {
      setErrMsg('Database operation failed.');
    }
  };

  // Submit banner modifications to server
  const handleSaveAds = async () => {
    try {
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: localAds })
      });
      if (res.ok) {
        onUpdateAds(localAds);
        setSuccessMsg('Sarkari Career Hub Ad slots synced perfectly!');
      } else {
        setErrMsg('Failed to publish advertisements config.');
      }
    } catch {
      setErrMsg('Advertisements storage connection failure.');
    }
  };

  // Standard Login Screen layout
  if (!isAuthorized) {
    return (
      <div id="admin-passcode-portal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl relative">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 bg-slate-900 rounded-2xl text-white shadow-md">
              <Key className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="font-display text-xl font-bold dark:text-white">Admin Authorizations Link</h3>
            <p className="text-xs text-gray-500">Provide standard security passkey to access operational dashboard parameters.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Internal Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-center dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="block text-[10px] text-center text-amber-500 font-mono mt-2">Passcode Suggestion: admin123 or admin.hub</span>
            </div>

            {authError && (
              <p className="text-xs text-center text-red-500 font-medium">⚠️ {authError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Authorize Credentials
            </button>
          </form>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ❌
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-console-full" className="fixed inset-0 bg-slate-100 dark:bg-slate-950 flex z-55 overflow-hidden">
      
      {/* Dynamic Left Admin sidebar navigation rail */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-850">
        <div className="p-6 border-b border-slate-850 flex items-center gap-2">
          <Building className="w-6 h-6 text-brand-500" />
          <span className="font-display text-base font-extrabold tracking-tight text-white">Hub Console Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'stats' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Metrics</span>
          </button>
          <button 
            onClick={() => setActiveTab('create-post')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'create-post' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Plus className="w-4 h-4" />
            <span>Draft New Alert</span>
          </button>
          <button 
            onClick={() => setActiveTab('all-posts')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'all-posts' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Index Database ({jobs.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'banners' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Manage Ads Slots</span>
          </button>
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'subscribers' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter Members ({subs.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${activeTab === 'inbox' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Inbox className="w-4 h-4" />
            <span>Feedback Inbox ({contactMsgs.length})</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-850 space-y-2">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Terminal status: LIVE</span>
          </div>
          <button 
            onClick={() => { setIsAuthorized(false); setPassword(''); }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-850 hover:bg-slate-800 text-rose-450 hover:text-rose-500 font-semibold text-xs rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Hub Console</span>
          </button>
        </div>
      </aside>

      {/* Dynamic Right Side Control Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-y-auto">
        <header className="px-8 py-4 border-b border-gray-150 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white capitalize">
            Sarkari Career Hub Console Panel · <span className="text-brand-600 text-sm">{activeTab.replace('-', ' ')}</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1 px-3 bg-red-100 dark:bg-rose-950/20 hover:bg-rose-500 hover:text-white text-rose-600 font-bold text-xs rounded-lg cursor-pointer"
          >
            Close Board
          </button>
        </header>

        <div className="p-8 max-w-5xl w-full">
          {/* Global Alert Notices banner */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-center gap-2 text-green-700 dark:text-green-300 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}
          {errMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-2 text-red-700 dark:text-red-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>{errMsg}</p>
            </div>
          )}

          {/* TAB 1: OVERVIEW STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Alert Post Files</span>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="w-6 h-6 text-brand-600" />
                    <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalJobs}</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Aggregated Views count</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Eye className="w-6 h-6 text-teal-600" />
                    <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalViews}</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Documents downloads metric</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Download className="w-6 h-6 text-amber-600" />
                    <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalDownloads}</span>
                  </div>
                </div>
              </div>

              {/* Console status log details */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border rounded-2xl">
                <h4 className="font-display font-medium text-xs uppercase text-slate-500 tracking-wider mb-2">Live Console System Parameters</h4>
                <div className="font-mono text-xs space-y-1 text-slate-650 dark:text-slate-400">
                  <p>• Database Driver: JSON FS-Indexed-Store (Durable)</p>
                  <p>• Upload Storage: Host Isolated Local Storage Server</p>
                  <p>• Registered Newsletter accounts: {stats.totalSubscribers} active profiles</p>
                  <p>• Incoming user enquiries pool: {contactMsgs.length} queries</p>
                  <p>• Port: 3000 Ingress Binding Security rules checked</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / DRAFT FORM NEW POSTS */}
          {activeTab === 'create-post' && (
            <form onSubmit={handleCreatePostSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Post / Notification Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. UPSC civil recruitment board pre 2026"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-750 bg-gray-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Routing Slug (Generated)</label>
                  <input 
                    type="text" 
                    readOnly
                    value={slug}
                    placeholder="Auto generated slug link"
                    className="w-full px-4 py-2 border border-blue-200 dark:border-slate-800 bg-blue-50/10 dark:bg-slate-900 font-mono text-xs text-brand-650 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Short Description (Ticker/Cards view)</label>
                <textarea 
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summarize the core notification values..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-750 bg-gray-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Board / Organization logo prefix</label>
                  <input 
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. SSC, UPSC, RAILWAY"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-750 bg-gray-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Category Area</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-755 bg-gray-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Last Apply Date</label>
                  <input 
                    type="text" 
                    required
                    value={lastDate}
                    onChange={(e) => setLastDate(e.target.value)}
                    placeholder="e.g. 2026-07-15"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-755 bg-gray-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Assigned State</label>
                  <select 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-755 bg-gray-50 dark:bg-slate-950 text-xs text-slate-905 dark:text-white rounded-xl"
                  >
                    {STATES_LIST.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Minimum Qualification</label>
                  <select 
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-755 bg-gray-50 dark:bg-slate-950 text-xs text-slate-905 dark:text-white rounded-xl"
                  >
                    {QUALIFICATIONS_LIST.map((q, i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Target Department</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-755 bg-gray-55 dark:bg-slate-950 text-xs text-slate-905 dark:text-white rounded-xl"
                  >
                    {DEPARTMENTS_LIST.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Metadata Helper string boxes */}
              <div className="p-5 rounded-2xl bg-blue-50/20 dark:bg-slate-950/50 border border-blue-150 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <span>🛠️ Parametric Metadata lists (Comma-delimited format)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Important Dates (Event:Date)</label>
                    <input 
                      type="text" 
                      value={datesStr}
                      onChange={(e) => setDatesStr(e.target.value)}
                      className="w-full font-mono text-[11px] px-3 py-1.5 border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Application Fees (Cat:Fee)</label>
                    <input 
                      type="text" 
                      value={feesStr}
                      onChange={(e) => setFeesStr(e.target.value)}
                      className="w-full font-mono text-[11px] px-3 py-1.5 border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Board Links (Label:Url)</label>
                    <input 
                      type="text" 
                      value={linksStr}
                      onChange={(e) => setLinksStr(e.target.value)}
                      className="w-full font-mono text-[11px] px-3 py-1.5 border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* DRAG-AND-DROP / ENHANCED PDF FILE UPLOADER */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">PDF Notification Sheet Attachment</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-800 hover:border-brand-500 rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/30 text-center relative transition-colors duration-300">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/20 text-red-650 flex items-center justify-center">
                      <Upload className="w-5 h-5 animate-bounce" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      <strong>Drag and drop here</strong> or select a PDF file manually to convert instantly.
                    </div>
                    {pdfFileName && (
                      <p className="text-xs text-brand-600 font-semibold truncate max-w-sm mx-auto">
                        ✓ Selected attachment: {pdfFileName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">Full Detailed post (Editorial Markdown/Text)</label>
                <textarea 
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="## Scheme structure etc..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-750 bg-gray-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white font-mono rounded-xl focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg ease-in-out duration-300 text-center block"
              >
                {isUploading ? 'Syncing PDF...' : 'Publish Notification Alert Instantly'}
              </button>
            </form>
          )}

          {/* TAB 3: INDEX ALL POSTS */}
          {activeTab === 'all-posts' && (
            <div className="rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 uppercase text-[10px] font-mono tracking-wider border-b border-gray-100 dark:border-slate-850">
                  <tr>
                    <th className="px-6 py-4 dark:text-white">Alert Title & Category</th>
                    <th className="px-6 py-4 dark:text-white">Registered State</th>
                    <th className="px-6 py-4 dark:text-white">Closes On</th>
                    <th className="px-6 py-4 dark:text-white text-center">Stats</th>
                    <th className="px-6 py-4 text-right dark:text-white">Operational action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                  {jobs.map(j => (
                    <tr key={j.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-850 dark:text-slate-200 block max-w-sm truncate leading-tight">{j.title}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-1.5 py-0.5 font-mono mt-1 inline-block uppercase">{j.category}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-350">{j.state}</td>
                      <td className="px-6 py-4 text-red-500 font-mono font-bold">{j.lastDate}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-400">👁️ {j.views} • ⬇️ {j.downloads}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeletePost(j.id)}
                          className="p-1 px-3 bg-red-100 hover:bg-rose-600 text-red-650 hover:text-white font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: MANAGE ADS SLOTS BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-905 rounded-xl text-yellow-800 dark:text-yellow-250 text-xs leading-relaxed flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>Customize banner urls or place visual Google Adsense snippet properties securely below. Changes propagate globally instantly.</p>
              </div>

              {localAds.map((ad, idx) => (
                <div key={ad.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-855 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-2 mb-2 dark:border-slate-850">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-750 dark:text-white">Slot Position: {ad.location.toUpperCase()}</span>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={ad.active}
                        onChange={(e) => {
                          const updated = [...localAds];
                          updated[idx].active = e.target.checked;
                          setLocalAds(updated);
                        }}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Banner Image URL</label>
                      <input 
                        type="text" 
                        value={ad.bannerUrl || ''}
                        onChange={(e) => {
                          const updated = [...localAds];
                          updated[idx].bannerUrl = e.target.value;
                          setLocalAds(updated);
                        }}
                        placeholder="Paste premium custom unsplash / partner banner JPG link"
                        className="w-full text-xs font-mono px-3 py-1.5 border bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Click destination Redirect URL</label>
                      <input 
                        type="text" 
                        value={ad.redirectUrl || ''}
                        onChange={(e) => {
                          const updated = [...localAds];
                          updated[idx].redirectUrl = e.target.value;
                          setLocalAds(updated);
                        }}
                        placeholder="https://google.com/adsense-partner-target"
                        className="w-full text-xs font-mono px-3 py-1.5 border bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Google AdSense Frame HTML snippet code (If type is code)</label>
                    <textarea 
                      rows={2}
                      value={ad.htmlSnippet || ''}
                      onChange={(e) => {
                        const updated = [...localAds];
                        updated[idx].htmlSnippet = e.target.value;
                        setLocalAds(updated);
                      }}
                      placeholder="e.g. <ins class='adsbygoogle' style='display:block' data-ad-client='ca-pub-xxx' data-ad-slot='xxx'></ins>"
                      className="w-full font-mono text-[11px] px-3 py-1.5 border bg-white dark:bg-slate-900 rounded-lg dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={handleSaveAds}
                className="w-full py-3 bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                Save Advertisements Schema Changes
              </button>
            </div>
          )}

          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <h4 className="font-display font-medium text-slate-800 dark:text-white text-sm">Indexed Email accounts for Direct Daily alerts:</h4>
              <div className="rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 uppercase text-[10px] font-mono tracking-wider border-b border-gray-105">
                    <tr>
                      <th className="px-6 py-3 dark:text-white">Active Subscriber Email Address</th>
                      <th className="px-6 py-3 dark:text-white">Subscription Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                    {subs.map(sb => (
                      <tr key={sb.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold font-mono text-slate-800 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-brand-600" />
                          <span>{sb.email}</span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500 font-mono">{new Date(sb.subscribedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {subs.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center p-8 text-gray-400 font-mono text-xs">No active newsletter signups found on the server database file.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT INBOX MESSAGES */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <h4 className="font-display font-medium text-slate-800 dark:text-white text-sm">Enquires messages from Candidates:</h4>
              <div className="space-y-4">
                {contactMsgs.map((msg) => (
                  <div key={msg.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">Subject: {msg.subject}</h4>
                        <p className="text-xs text-slate-500 font-medium">From: <strong className="text-slate-805 dark:text-brand-300 font-mono">{msg.name} ({msg.email})</strong></p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="p-4 rounded-xl bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-300 text-xs whitespace-pre-line border border-gray-100 dark:border-slate-850 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
                {contactMsgs.length === 0 && (
                  <p className="text-center p-8 text-gray-400 border border-dashed rounded-2xl font-mono text-xs">No incoming enquiry submissions in the storage file.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
