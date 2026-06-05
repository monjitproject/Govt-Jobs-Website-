/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 
  | 'latest-job' 
  | 'central-gov' 
  | 'state-gov' 
  | 'railway' 
  | 'ssc' 
  | 'upsc' 
  | 'bank' 
  | 'police' 
  | 'defence' 
  | 'teaching' 
  | 'admit-card' 
  | 'result' 
  | 'answer-key' 
  | 'syllabus' 
  | 'admission' 
  | 'scholarship' 
  | 'important-update';

export interface Category {
  id: string;
  name: string;
  slug: CategoryType;
  icon: string;
}

export interface ImportantDate {
  event: string;
  date: string;
}

export interface ApplicationFee {
  category: string;
  amount: string;
}

export interface ImportantLink {
  label: string;
  url: string;
  isExternal: boolean;
}

export interface JobPost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string; // Markdown supported
  pdfUrl?: string; // Embedded PDF viewer
  featuredImage?: string;
  category: CategoryType;
  tags: string[];
  department: string;
  state: string; // "All India", "Delhi", "Uttar Pradesh", etc.
  qualification: string; // "10th", "12th", "Graduate", "B.Tech", etc.
  orgName: string; // SSC, UPSC, IBPS, RAILWAY
  experience: string; // "Fresher", "Experienced"
  lastDate: string; // ISO date string or human readable
  importantDates: ImportantDate[];
  eligibility: string;
  applicationFees: ApplicationFee[];
  importantLinks: ImportantLink[];
  createdAt: string;
  downloads: number;
  views: number;
  admitCardId?: string; // Connected admit card
  resultId?: string; // Connected result
}

export interface AdmitCard {
  id: string;
  title: string;
  slug: string;
  jobId?: string; // Associated job ID if any
  releaseDate: string;
  examDate?: string;
  admitCardUrl: string; // Direct link
  instructions?: string;
  views: number;
  downloads: number;
  createdAt: string;
}

export interface JobResult {
  id: string;
  title: string;
  slug: string;
  jobId?: string;
  releaseDate: string;
  meritListUrl?: string;
  cutOffUrl?: string;
  officialResultUrl: string;
  views: number;
  downloads: number;
  createdAt: string;
}

export interface AnswerKey {
  id: string;
  title: string;
  slug: string;
  jobId?: string;
  releaseDate: string;
  pdfUrl: string;
  officialUrl?: string;
  views: number;
  createdAt: string;
}

export interface Syllabus {
  id: string;
  title: string;
  slug: string;
  jobId?: string;
  examPatternDetail?: string; // Text/Markdown pattern
  pdfUrl: string;
  views: number;
  createdAt: string;
}

export interface QuizItem {
  id: string;
  title: string;
  examName: string;
  date: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  location: 'header' | 'sidebar' | 'in-content' | 'footer';
  type: 'image' | 'code';
  bannerUrl?: string;
  redirectUrl?: string;
  htmlSnippet?: string; // For AdSense iframe / code snippets
  active: boolean;
}

export interface PortalStats {
  totalJobs: number;
  totalAdmitCards: number;
  totalResults: number;
  totalViews: number;
  totalDownloads: number;
  totalSubscribers: number;
}
