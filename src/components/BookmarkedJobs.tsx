/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JobPost } from '../types';
import { X, BookmarkCheck, ArrowRight, Clipboard, Trash, Clock } from 'lucide-react';

interface BookmarkedJobsProps {
  onClose: () => void;
  savedJobs: JobPost[];
  onRemoveBookmark: (id: string) => void;
  onNavigate: (path: string) => void;
}

export default function BookmarkedJobs({ 
  onClose, 
  savedJobs, 
  onRemoveBookmark, 
  onNavigate 
}: BookmarkedJobsProps) {
  
  const handleItemPress = (slug: string) => {
    onNavigate(`/jobs/${slug}`);
    onClose();
  };

  return (
    <div id="bookmarks-modal-overlay" className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
        
        {/* Header banner */}
        <header className="px-6 py-5 bg-slate-50 dark:bg-slate-950 border-b border-gray-150 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-brand-600" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-850 dark:text-white">
              My Saved Alerts
            </h3>
            <span className="font-mono text-xs font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">
              {savedJobs.length} Alerts
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 bg-gray-100 hover:bg-rose-500 hover:text-white dark:bg-slate-800 text-gray-400 font-bold text-xs rounded-lg cursor-pointer"
          >
            Close
          </button>
        </header>

        {/* Saved List container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <span className="text-4xl block">⭐</span>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-sans max-w-xs mx-auto">
                No indexed government job advertisements bookmarked. Click the <strong>Save Notification</strong> button inside any listing.
              </p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div 
                key={job.id} 
                className="p-4 rounded-2xl border border-gray-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-brand-500 transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div 
                  onClick={() => handleItemPress(job.slug)}
                  className="flex-1 cursor-pointer group min-w-0"
                >
                  <span className="text-[9px] bg-brand-50 text-brand-650 dark:bg-brand-950/30 dark:text-brand-350 px-2 py-0.5 rounded font-mono font-bold uppercase select-none">
                    {job.orgName}
                  </span>
                  <h4 className="font-heading font-bold text-xs md:text-sm text-slate-850 dark:text-slate-100 mt-1 truncate group-hover:text-brand-600">
                    {job.title}
                  </h4>
                  <p className="text-[10px] font-mono text-gray-400 dark:text-slate-450 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>Apply deadline: {job.lastDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleItemPress(job.slug)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-brand-600 hover:bg-brand-500 hover:text-white"
                    title="View post details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onRemoveBookmark(job.id)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-rose-500 hover:bg-rose-550 hover:text-white"
                    title="Remove Bookmark"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-gray-100 dark:border-slate-850 text-center">
          <p className="text-[10px] text-gray-450 font-mono">
            * Bookmarks are saved directly inside your browser cache.
          </p>
        </footer>

      </div>
    </div>
  );
}
