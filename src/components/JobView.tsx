/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JobPost, CategoryType } from '../types';
import { 
  Calendar, FileDown, Eye, Share2, Clipboard, Bookmark, 
  BookmarkCheck, Printer, ArrowLeft, ChevronRight, CheckCircle, 
  ShieldCheck, AlertCircle, FileText, ChevronDown, List 
} from 'lucide-react';
import AdBar from './AdBar';

interface JobViewProps {
  job: JobPost;
  relatedJobs: JobPost[];
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onNavigate: (path: string) => void;
  onDownloadPdf: (jobId: string) => void;
  adsList: any[];
}

export default function JobView({ 
  job, 
  relatedJobs, 
  isBookmarked, 
  onToggleBookmark, 
  onNavigate,
  onDownloadPdf,
  adsList
}: JobViewProps) {
  const [copied, setCopied] = useState(false);
  const [downloadCount, setDownloadCount] = useState(job.downloads);

  // Parse custom tags preview
  const tagsList = job.tags || [];

  const handleShare = () => {
    const fullUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.shortDescription,
        url: fullUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadClick = () => {
    onDownloadPdf(job.id);
    setDownloadCount(prev => prev + 1);
    if (job.pdfUrl) {
      window.open(job.pdfUrl, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="job-view-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back & Share Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <button 
          onClick={() => onNavigate('/')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-650"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs Index</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Trigger */}
          <button 
            onClick={onToggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
              isBookmarked 
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isBookmarked ? 'Saved' : 'Save Notification'}</span>
          </button>

          {/* Social Share */}
          <button 
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-gray-50"
            title="Share notification"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-[10px] font-mono text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded">
              Copied Link!
            </span>
          )}

          {/* Print Alert */}
          <button 
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-gray-50"
            title="Print syllabus specifications"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Core View Grid (Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Editorial Post details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-brand-50 text-brand-650 dark:bg-brand-950/30 dark:text-brand-400 mb-4">
              Category: {job.category.toUpperCase().replace('-', ' ')}
            </span>
            
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-450 border-b border-gray-100 dark:border-slate-850 pb-5 mb-5 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Posted On: {new Date(job.createdAt).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-red-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Apply Before: {job.lastDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Views: {job.views || 0}</span>
              </span>
            </div>

            {/* Quick summary disclaimer box */}
            <p className="text-gray-600 dark:text-slate-300 text-sm md:text-base leading-relaxed bg-gray-50 dark:bg-slate-950/40 p-4 rounded-2xl border-l-4 border-brand-500 mb-6 font-sans">
              {job.shortDescription}
            </p>

            {/* AD BANNER: IN CONTENT */}
            <AdBar location="in-content" adsList={adsList} />

            {/* Important Info Tables */}
            <div id="quick-tables" className="space-y-6 my-8">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <List className="w-5 h-5 text-brand-500" />
                <span>Summary Parameters Table</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dates Table */}
                <div className="rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-950/70 p-3 font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-gray-150 dark:border-slate-800">
                    🗓️ Important Recruiment Dates
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {job.importantDates && job.importantDates.map((d, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-medium text-gray-500 dark:text-slate-400">{d.event}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-slate-850 dark:text-slate-100">{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Application Fee */}
                <div className="rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-950/70 p-3 font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-gray-150 dark:border-slate-800">
                    💰 Application Fee structure
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {job.applicationFees && job.applicationFees.map((f, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-medium text-gray-500 dark:text-slate-400">{f.category}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-brand-650 dark:text-brand-400">{f.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Eligibility Criteria Box */}
              <div className="p-5 rounded-2xl bg-teal-50/30 dark:bg-slate-950/30 border border-teal-100 dark:border-slate-800">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-2">
                  🎓 Academic Eligibility & Qualification Limits
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {job.eligibility}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 font-mono text-[10px] text-gray-500">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Department: {job.department}</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">State Zone: {job.state}</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">Min Credential: {job.qualification}</span>
                </div>
              </div>
            </div>

            {/* Structured Content Markdowns */}
            <div className="prose dark:prose-invert text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-8 space-y-4 font-sans">
              {job.content.split('\n\n').map((block, index) => {
                if (block.startsWith('## ')) {
                  return <h2 key={index} className="font-display text-lg font-bold text-slate-900 dark:text-white pt-4">{block.replace('## ', '')}</h2>;
                }
                if (block.startsWith('### ')) {
                  return <h3 key={index} className="font-display text-sm font-bold text-slate-900 dark:text-white pt-2">{block.replace('### ', '')}</h3>;
                }
                if (block.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-1.5 pl-2">
                      {block.split('\n').map((li, k) => (
                        <li key={k}>{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index} className="whitespace-pre-line">{block}</p>;
              })}
            </div>

            {/* Embedded Live PDF Document Viewer */}
            {job.pdfUrl ? (
              <div id="pdf-viewer-block" className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-850">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-5 h-5 text-rose-500 animate-pulse" />
                    <span>Embedded PDF Document (Official Notice)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{downloadCount} Direct Loads</span>
                    <button 
                      onClick={handleDownloadClick}
                      className="bg-red-650 hover:bg-red-750 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Viewer using customized frame styling inside iframe or dynamic fallback object */}
                <div className="w-full relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-850 bg-slate-900 shadow-lg" style={{ height: '480px' }}>
                  <iframe 
                    src={`${job.pdfUrl}#toolbar=0`} 
                    title="UPSC CGL Railway Sarkari Recruitment PDF Guide document"
                    width="100%" 
                    height="100%" 
                    className="border-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle watermarked overlay banner to protect reader integrity */}
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 py-1 px-2.5 rounded-md flex items-center gap-1 select-none font-mono tracking-widest uppercase">
                    <ShieldCheck className="w-3 h-3 text-brand-500" />
                    <span>Sarkari Career Hub Secured Reader</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-gray-400 text-xs font-mono border">
                No indexed PDF attachment found. Read summary content above.
              </div>
            )}

            {/* Table of Official links & Board redirects */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-850">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                🔗 Recruitment Board Application Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.importantLinks && job.importantLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 text-xs font-semibold text-brand-650 dark:text-brand-400 block truncate"
                  >
                    🚀 {link.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Sidebar recommendations and Ad placement */}
        <div className="space-y-6">
          
          {/* AD SLOT: SIDEBAR INSTRUCTIONS */}
          <AdBar location="sidebar" adsList={adsList} />

          {/* Quick Stats Block representation */}
          <div className="bg-slate-900 border border-slate-850 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg select-none">
            <h4 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-1">
              <span>⚡ Alert Popularity metrics</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="block font-mono text-xl font-bold text-brand-400">{job.views + 231}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Loads Views</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="block font-mono text-xl font-bold text-teal-400">{downloadCount + 89}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">PDF Fetches</span>
              </div>
            </div>
            {/* Countdown layout */}
            <div className="mt-5 p-3 rounded-xl bg-orange-950/30 border border-orange-900/40 text-orange-400 text-xs text-center font-mono flex items-center gap-2 justify-center">
              <span>⏳ Status:</span>
              <span className="font-bold">Urgent Action Recommended</span>
            </div>
          </div>

          {/* Related Jobs Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 shadow-xl">
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-slate-850 flex items-center justify-between">
              <span>Related Job Alerts</span>
              <span className="text-[9px] font-mono font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">Engine Match</span>
            </h3>

            {relatedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 font-sans">No matching related government jobs found matching categories.</p>
            ) : (
              <div className="space-y-3.5">
                {relatedJobs.map((rJob) => (
                  <div 
                    key={rJob.id}
                    onClick={() => {
                      onNavigate(`/jobs/${rJob.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl border border-gray-150 dark:border-slate-800 hover:border-brand-500 bg-gray-50/50 dark:bg-slate-950/20 hover:bg-brand-50/10 cursor-pointer group"
                  >
                    <span className="text-[10px] bg-gray-200 dark:bg-slate-800 text-gray-500 font-mono font-semibold px-2 py-0.5 rounded">
                      {rJob.orgName}
                    </span>
                    <h4 className="font-sans font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-brand-600 mt-1.5 leading-snug line-clamp-2">
                      {rJob.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-gray-400">
                      <span>Apply: {rJob.lastDate}</span>
                      <span className="flex items-center gap-0.5 text-brand-600 uppercase font-bold group-hover:underline">
                        <span>Preview</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
