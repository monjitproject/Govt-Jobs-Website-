/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CATEGORIES, TRENDING_NEWS } from '../data';
import { 
  Building, Briefcase, ShieldAlert, Map, Train, Award, Coins, 
  Building2, Shield, Sword, GraduationCap, FileText, FileCheck, 
  Key, BookOpen, UserCheck, Heart, Bell, Moon, Sun, Search, 
  Bookmark, Menu, X, Terminal, ChevronRight, Share2 
} from 'lucide-react';
import { CategoryType } from '../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
  savedJobsCount: number;
  onOpenSavedModal: () => void;
  onOpenAdminPanel: () => void;
}

const iconMap: Record<string, any> = {
  Briefcase, ShieldAlert, Map, Train, Award, Coins, Building, 
  Shield, Sword, GraduationCap, FileText, FileCheck, Key, BookOpen, 
  UserCheck, Heart, Bell
};

export default function Header({ 
  currentPath, 
  onNavigate, 
  onSearch, 
  dark, 
  onToggleTheme, 
  savedJobsCount,
  onOpenSavedModal,
  onOpenAdminPanel
}: HeaderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  // Handle auto-rotate breaking news ticker
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TRENDING_NEWS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigate('/');
  };

  return (
    <header id="site-header" className="relative w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
      {/* 1. Breaking News Ticker Banner */}
      <div id="news-ticker-container" className="bg-brand-900 dark:bg-slate-950 text-white text-xs md:text-sm h-8 flex items-center px-4 shadow-inner overflow-hidden select-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider font-extrabold shrink-0 bg-amber-500 text-slate-950 text-[9px] md:text-[10px] px-2 py-0.5 rounded shadow-sm">
            Breaking Update
          </div>
          <div className="flex-1 overflow-hidden mx-2 relative h-5">
            <div className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out font-sans font-medium text-xs text-slate-100 truncate">
              {TRENDING_NEWS[tickerIndex]}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] opacity-90 font-mono text-amber-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Upper Branding and Control Panel */}
      <div id="upper-branding" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => { onNavigate('/'); onSearch(''); setSearchVal(''); }} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transform duration-300">
            S
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold tracking-tight text-brand-900 dark:text-white leading-none">
              Sarkari<span className="text-brand-600 dark:text-brand-400">Career</span>
            </h1>
            <p className="font-sans text-[8px] md:text-[10px] font-medium text-gray-400 dark:text-slate-500 tracking-wider uppercase mt-1">
              Hub of Trustworthy Job & Result Alerts
            </p>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-6">
          <div className="relative w-full">
            <input 
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search latest jobs, admit cards, or results..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-full text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-inner"
            />
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-gray-400" />
          </div>
          <button 
            type="submit"
            className="ml-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-md"
          >
            Search
          </button>
        </form>

        {/* Global Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved post bookmarks */}
          <button 
            onClick={onOpenSavedModal}
            className="p-2 relative rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
            title="Saved Notifications"
          >
            <Bookmark className="w-5 h-5" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                {savedJobsCount}
              </span>
            )}
          </button>

          {/* Dark Mode toggle */}
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Special Admin Dashboard Button */}
          <button
            onClick={onOpenAdminPanel}
            className="hidden sm:flex items-center gap-1 bg-slate-900 dark:bg-slate-800 text-white font-mono hover:bg-brand-600 dark:hover:bg-brand-700 text-xs px-3.5 py-2 rounded-lg cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>

          {/* Mobile Hamburguer Drawer Trigger */}
          <button 
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Category Bar Navigation (Main categories quick search filter tabs) */}
      <nav id="category-navigation" className="bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start overflow-x-auto gap-2 py-3 scrollbar-none scroll-smooth">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon] || Briefcase;
              const isSelected = currentPath === `/category/${cat.slug}`;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate(`/category/${cat.slug}`);
                    setNavOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border ${
                    isSelected 
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-102 font-display bg-gradient-to-r from-brand-600 to-brand-850'
                      : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Mobile Expand Panel */}
      {navOpen && (
        <div id="mobile-navigation-panel" className="md:hidden absolute w-full left-0 top-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-2xl p-4 z-40 transition-all duration-300">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <input 
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search exam notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
            <button type="submit" className="hidden" />
          </form>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              onClick={() => { onNavigate('/'); onSearch(''); setSearchVal(''); setNavOpen(false); }}
              className="p-2.5 text-left text-xs font-medium rounded-lg text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750"
            >
              🏠 Home Portal
            </button>
            <button 
              onClick={() => { onOpenSavedModal(); setNavOpen(false); }}
              className="p-2.5 text-left text-xs font-medium rounded-lg text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750"
            >
              ⭐️ Bookmarked Post
            </button>
            <button 
              onClick={() => { onOpenAdminPanel(); setNavOpen(false); }}
              className="p-2.5 text-left text-xs font-mono font-medium rounded-lg text-white bg-slate-900 dark:bg-slate-800 hover:bg-brand-600"
            >
              💻 Admin Panel
            </button>
          </div>

          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Primary Divisions</p>
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate(`/category/${cat.slug}`);
                  setNavOpen(false);
                }}
                className="flex items-center gap-1.5 py-1.5 px-2 text-left text-xs text-gray-650 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
              >
                <ChevronRight className="w-3.5 h-3.5 text-brand-500" />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
