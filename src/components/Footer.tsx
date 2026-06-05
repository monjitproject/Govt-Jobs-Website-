/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ type: 'loading', message: '' });
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Thank you! You have successfully subscribed to daily job alerts.' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network connection lost. Clean your setup.' });
    }
  };

  return (
    <footer id="site-footer" className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Newsletter Box (Upper) */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Get Fast Sarkari Job Alerts Directly
            </h3>
            <p className="text-brand-100 text-sm md:text-base mt-2 opacity-90">
              Join 124,000+ subscription candidates. Subscribe to receive central and state government job alerts on your email every day!
            </p>
          </div>
          <div className="w-full max-w-md">
            <form onSubmit={handleSubscribe} className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-inner">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your active email..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
              <button 
                type="submit"
                disabled={status.type === 'loading'}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{status.type === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {status.message && (
              <p className={`text-xs mt-3 text-center lg:text-left font-medium ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        {/* 2. Structured Link Columns (Middle) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-brand-600 rounded-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Sarkari Career Hub
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              India&apos;s leading secure platform providing Instant Job Alerts, download sheets, Merit list PDF releases, official board announcements, admissions, and exam answer keys.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <span>🔒 High-security SSL</span>
              <span>•</span>
              <span>⚡ Fast load</span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-white text-sm font-bold uppercase tracking-wider mb-4">Job Portals</h4>
            <ul className="space-y-2.5 text-xs md:text-sm">
              <li><button onClick={() => onNavigate('/category/latest-job')} className="hover:text-white hover:underline text-slate-400 text-left">Latest Sarkari Jobs</button></li>
              <li><button onClick={() => onNavigate('/category/central-gov')} className="hover:text-white hover:underline text-slate-400 text-left">Central Govt Postings</button></li>
              <li><button onClick={() => onNavigate('/category/state-gov')} className="hover:text-white hover:underline text-slate-400 text-left">State Civil Jobs</button></li>
              <li><button onClick={() => onNavigate('/category/railway')} className="hover:text-white hover:underline text-slate-400 text-left">Railway Recruitment RRB</button></li>
              <li><button onClick={() => onNavigate('/category/ssc')} className="hover:text-white hover:underline text-slate-400 text-left">SSC Combined Level</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white text-sm font-bold uppercase tracking-wider mb-4">Exam Utilities</h4>
            <ul className="space-y-2.5 text-xs md:text-sm">
              <li><button onClick={() => onNavigate('/category/admit-card')} className="hover:text-white hover:underline text-slate-400 text-left">Latest Admit Card</button></li>
              <li><button onClick={() => onNavigate('/category/result')} className="hover:text-white hover:underline text-slate-400 text-left">Sarkari Results</button></li>
              <li><button onClick={() => onNavigate('/category/answer-key')} className="hover:text-white hover:underline text-slate-400 text-left">Exams Answer Keys</button></li>
              <li><button onClick={() => onNavigate('/category/syllabus')} className="hover:text-white hover:underline text-slate-400 text-left">Syllabus Outlines</button></li>
              <li><button onClick={() => onNavigate('/category/admission')} className="hover:text-white hover:underline text-slate-400 text-left">Admission & Scholarship</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white text-sm font-bold uppercase tracking-wider mb-4">AdSense Compliance</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('/about')} className="hover:text-white hover:underline text-slate-400 text-left">About Us</button></li>
              <li><button onClick={() => onNavigate('/contact')} className="hover:text-white hover:underline text-slate-400 text-left">Contact Us</button></li>
              <li><button onClick={() => onNavigate('/policy/privacy')} className="hover:text-white hover:underline text-slate-400 text-left">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/policy/terms')} className="hover:text-white hover:underline text-slate-400 text-left">Terms of Use</button></li>
              <li><button onClick={() => onNavigate('/policy/disclaimer')} className="hover:text-white hover:underline text-slate-400 text-left">Disclaimer</button></li>
              <li><button onClick={() => onNavigate('/policy/dmca')} className="hover:text-white hover:underline text-slate-400 text-left">DMCA Policy</button></li>
              <li><button onClick={() => onNavigate('/policy/editorial')} className="hover:text-white hover:underline text-slate-400 text-left">Editorial Policy</button></li>
              <li><button onClick={() => onNavigate('/policy/cookie')} className="hover:text-white hover:underline text-slate-400 text-left">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        {/* 3. Credits & Disclaimer Warning (Bottom) */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-slate-500 text-[10px] md:text-xs">
              © 2026 Sarkari Career Hub (sarkaricareerhub.com). All Rights Reserved. Not affiliated with any official government branch.
            </p>
            <p className="text-slate-600 text-[9px] md:text-[10px] max-w-4xl leading-tight">
              Disclaimer: Sarkari Career Hub is a purely informative educational resources index. We do not issue credentials, host applications directly, or represent any state commission. Please verify every info on the officially specified board notification beforehand.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0 font-display">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Indian Aspirants</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
