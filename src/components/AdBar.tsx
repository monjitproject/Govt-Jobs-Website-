/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Advertisement } from '../types';
import { ExternalLink, Info } from 'lucide-react';

interface AdBarProps {
  location: 'header' | 'sidebar' | 'in-content' | 'footer';
  adsList: Advertisement[];
}

export default function AdBar({ location, adsList }: AdBarProps) {
  // Find the active advertisement for this specific DOM spot
  const activeAd = adsList.find(ad => ad.location === location && ad.active);

  if (!activeAd) return null;

  // Render locations styling helper
  const containerStyle = {
    header: "w-full max-w-7xl mx-auto px-4 my-4",
    sidebar: "w-full sticky top-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-800 p-2 bg-gray-50 dark:bg-slate-900/50 text-center shadow-md",
    'in-content': "my-6 p-2 rounded-xl bg-gray-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 text-center",
    footer: "w-full max-w-7xl mx-auto px-4 my-8"
  }[location];

  const contentStyle = {
    header: "w-full h-[90px] md:h-[120px] rounded-xl overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800 flex items-center justify-center relative",
    sidebar: "w-full min-h-[300px] rounded-lg overflow-hidden flex flex-col justify-between items-center relative",
    'in-content': "w-full min-h-[100px] rounded-xl overflow-hidden flex items-center justify-center relative border border-gray-100 dark:border-slate-800",
    footer: "w-full h-[100px] md:h-[140px] rounded-xl overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800 flex items-center justify-center relative"
  }[location];

  return (
    <div id={`ad-wrapper-${location}`} className={containerStyle}>
      <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-gray-400 dark:text-slate-500 mb-1 px-1">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Sponsored Advertisement</span>
        </span>
        <span className="text-[9px]">Google AdSense Compliant Slot</span>
      </div>

      <div className={`${contentStyle} bg-slate-100 dark:bg-slate-950/70 transition-all`}>
        {activeAd.type === 'code' && activeAd.htmlSnippet ? (
          // Simulated script injection or static HTML banner wrapper for Google AdSense
          <div 
            className="w-full h-full flex items-center justify-center text-xs text-red-500 font-mono text-center p-3"
            dangerouslySetInnerHTML={{ __html: activeAd.htmlSnippet }}
          />
        ) : activeAd.bannerUrl ? (
          // Custom banner image ad
          <a 
            href={activeAd.redirectUrl || "#"} 
            target="_blank" 
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="w-full h-full group block relative overflow-hidden"
          >
            <img 
              src={activeAd.bannerUrl} 
              alt="Sarkari Career Hub Partner Ad" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 duration-300" />
            <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md rounded-md p-1 opacity-0 group-hover:opacity-100 duration-300 text-white">
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        ) : (
          <div className="text-gray-400 text-xs font-mono p-4">
            Custom Advert Slot Vacant · Configure via Admin Dashboard
          </div>
        )}
      </div>
    </div>
  );
}
