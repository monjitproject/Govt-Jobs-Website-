/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobPost, AdmitCard, JobResult, AnswerKey, Syllabus, Advertisement, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Latest Jobs', slug: 'latest-job', icon: 'Briefcase' },
  { id: '2', name: 'Central Govt', slug: 'central-gov', icon: 'ShieldAlert' },
  { id: '3', name: 'State Govt', slug: 'state-gov', icon: 'Map' },
  { id: '4', name: 'Railways (RRB)', slug: 'railway', icon: 'Train' },
  { id: '5', name: 'SSC Jobs', slug: 'ssc', icon: 'Award' },
  { id: '6', name: 'UPSC Jobs', slug: 'upsc', icon: 'Coins' },
  { id: '7', name: 'Bank Jobs', slug: 'bank', icon: 'Building' },
  { id: '8', name: 'Police Jobs', slug: 'police', icon: 'Shield' },
  { id: '9', name: 'Defence Jobs', slug: 'defence', icon: 'Sword' },
  { id: '10', name: 'Teaching', slug: 'teaching', icon: 'GraduationCap' },
  { id: '11', name: 'Admit Card', slug: 'admit-card', icon: 'FileText' },
  { id: '12', name: 'Sarkari Result', slug: 'result', icon: 'FileCheck' },
  { id: '13', name: 'Answer Key', slug: 'answer-key', icon: 'Key' },
  { id: '14', name: 'Syllabus', slug: 'syllabus', icon: 'BookOpen' },
  { id: '15', name: 'Admission', slug: 'admission', icon: 'UserCheck' },
  { id: '16', name: 'Scholarship', slug: 'scholarship', icon: 'Heart' },
  { id: '17', name: 'Important Updates', slug: 'important-update', icon: 'Bell' },
];

export const STATES_LIST = [
  "All India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const QUALIFICATIONS_LIST = [
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "B.E/B.Tech",
  "B.Ed",
  "ITI",
  "MBBS/Medical"
];

export const DEPARTMENTS_LIST = [
  "Union Public Service Commission (UPSC)",
  "Staff Selection Commission (SSC)",
  "Railway Recruitment Board (RRB)",
  "Institute of Banking Personnel Selection (IBPS)",
  "Indian Army",
  "Indian Navy",
  "Indian Air Force",
  "State PSC (Uttar Pradesh UPPSC)",
  "State PSC (Bihar BPSC)",
  "State PSC (Rajasthan RPSC)",
  "Delhi Subordinate Services Selection Board (DSSSB)",
  "Central Board of Secondary Education (CBSE)"
];

export const INITIAL_JOBS: JobPost[] = [
  {
    id: 'job-1',
    title: 'UPSC Civil Services Exam (CSE) 2026 Notification',
    slug: 'upsc-civil-services-exam-cse-2026-notification',
    shortDescription: 'Union Public Service Commission (UPSC) has released the recruitment notification for IAS / IPS Civil Services Pre Exam 2026. Apply Online for 1056+ posts.',
    content: `## UPSC Civil Services Examination (CSE) 2026 Online Alert
Union Public Service Commission (UPSC) has issued the official notification for the Civil Services Examination (CSE) 2026. This prestigious exam recruits for Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and other central Group A & B services.

### Core Overview
Eligible candidates can fill the online application form from the official website **upsc.gov.in** before the last date. Please read the full exam scheme, selection parameters, and syllabus details carefully before entering the recruitment process.

### Highlights of vacancy:
- **Civil Services (IAS)**: Approx 1056 Vacancies
- **IFS (Forest Services)**: Multi-post entry through IAS Prelims`,
    category: 'upsc',
    tags: ['UPSC', 'IAS', 'IPS', 'Graduate Jobs'],
    department: 'Union Public Service Commission (UPSC)',
    state: 'All India',
    qualification: 'Graduate',
    orgName: 'UPSC',
    experience: 'Fresher',
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Released', date: '2026-06-01' },
      { event: 'Application Start Date', date: '2026-06-05' },
      { event: 'Last Date for Online Apply', date: '2026-07-15 (06:00 PM)' },
      { event: 'Preliminary Exam Date', date: '2026-09-20' },
      { event: 'Admit Card Available', date: 'September 2026' }
    ],
    eligibility: 'Candidate must hold a Graduate degree from any recognized university or institution in India in any stream.',
    applicationFees: [
      { category: 'General / OBC / EWS', amount: '₹100' },
      { category: 'SC / ST / PH', amount: '₹0 (Exempted)' },
      { category: 'Female Candidates (All Categories)', amount: '₹0 (Exempted)' }
    ],
    importantLinks: [
      { label: 'Apply Online Link (OTR registration)', url: 'https://upsconline.nic.in/', isExternal: true },
      { label: 'Download Official UPSC CSE Syllabus', url: 'https://upsc.gov.in/sites/default/files/Notification-CSPE-2026.pdf', isExternal: true },
      { label: 'Official Website upsc.gov.in', url: 'https://upsc.gov.in/', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-06-01T10:00:00Z',
    downloads: 1450,
    views: 4520,
    admitCardId: 'admit-1',
    resultId: 'result-1'
  },
  {
    id: 'job-2',
    title: 'SSC CGL 2026 Notification - Combine Graduate Level Exam',
    slug: 'ssc-cgl-2026-notification',
    shortDescription: 'Staff Selection Commission (SSC) has announced SSC CGL 2026 Notification for 17,000+ vacancies. Check post details, syllabus, dates, and apply instructions.',
    content: `## Staff Selection Commission (SSC) - CGL Recruitment 2026
Staff Selection Commission (SSC) is conducting the Combined Graduate Level (CGL) Examination 2026 for the recruitment of Group 'B' and Group 'C' posts in various Ministries, Departments, and Organizations of the Government of India.

### Available Post Profiles
- Assistant Section Officer (ASO) in Central Secretariat, Intelligence Bureau, Ministry of Railways
- Inspector (Central Excise / Examiner / Preventive Officer)
- Sub Inspector (CBI, NIA, Narcotics)
- Assistant Enforcement Officer (ED)
- Divisional Accountant, Audit Officer, Junior Statistical Officer (JSO)`,
    category: 'ssc',
    tags: ['SSC', 'CGL', 'Central Govt', 'Graduate Jobs'],
    department: 'Staff Selection Commission (SSC)',
    state: 'All India',
    qualification: 'Graduate',
    orgName: 'SSC',
    experience: 'Fresher',
    lastDate: '2026-07-25',
    importantDates: [
      { event: 'Notification Released', date: '2026-05-25' },
      { event: 'Apply Online Start', date: '2026-05-28' },
      { event: 'Last Date for Online Apply', date: '2026-07-25' },
      { event: 'Last Date Online Payment', date: '2026-07-26' },
      { event: 'SSC CGL Tier I Exam Date', date: 'October 2026' }
    ],
    eligibility: 'Bachelor Degree (Graduation) in any stream from a recognized University of India. Specialized posts like JSO require specific Mathematics/Statistics qualifications.',
    applicationFees: [
      { category: 'General / OBC / EWS', amount: '₹100' },
      { category: 'SC / ST / PH', amount: '₹0 (Exempted)' },
      { category: 'Women Candidates', amount: '₹0' }
    ],
    importantLinks: [
      { label: 'Register and Apply Online (SSC OTR Portal)', url: 'https://ssc.gov.in', isExternal: true },
      { label: 'Download Post-wise Vacancy Breakdown', url: 'https://ssc.gov.in', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-05-25T08:00:00Z',
    downloads: 3820,
    views: 9240
  },
  {
    id: 'job-3',
    title: 'RRB NTPC Graduate / Under-Graduate Recruitment 2026',
    slug: 'rrb-ntpc-recruitment-2026',
    shortDescription: 'Railway Recruitment Boards (RRB) has released NTPC 2026 notification for Commercial Apprentice, Station Master, Goods Guard, and Clerk posts. 11,500+ Jobs.',
    content: `## Railway Recruitment Boards (RRB) Non-Technical Popular Categories (NTPC)
Indian Railways (RRB) invites online applications from energetic male and female candidates for various Non-Technical Popular Category (NTPC) jobs in Indian Railways Zones.

### Post Layouts:
- **Graduate Posts**: Station Master, Goods Guard, Senior Clerk cum Typist, Commercial Apprentice.
- **Under-Graduate Posts**: Junior Clerk cum Typist, Account Clerk cum Typist, Trains Clerk, Ticket Clerk.`,
    category: 'railway',
    tags: ['Railway', 'RRB', 'NTPC', '12th Pass Jobs'],
    department: 'Railway Recruitment Board (RRB)',
    state: 'All India',
    qualification: '12th Pass',
    orgName: 'RRB',
    experience: 'Fresher',
    lastDate: '2026-08-10',
    importantDates: [
      { event: 'Detailed Notification Issue', date: '2026-06-03' },
      { event: 'Application Registration Starts', date: '2026-06-10' },
      { event: 'Closing Date of Registration', date: '2026-08-10' },
      { event: 'CBT Phase 1 Exam Date', date: 'December 2026' }
    ],
    eligibility: 'For Under Graduate Posts: 12th Intermediate with minimum 50% marks. For Graduate Posts: Bachelor Degree in any stream from a recognized board/university.',
    applicationFees: [
      { category: 'General / OBC / EWS', amount: '₹500 (₹400 refundable after Stage-1 CBT)' },
      { category: 'SC / ST / Female / PH / Minorities', amount: '₹250 (₹250 refundable after Stage-1 CBT)' }
    ],
    importantLinks: [
      { label: 'Register Active Regional RRB Portal', url: 'https://rrbcdg.gov.in', isExternal: true },
      { label: 'NTPC Exam Pattern & Selection Syllabus', url: 'https://rrbcdg.gov.in', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-06-03T14:30:00Z',
    downloads: 5120,
    views: 12400
  },
  {
    id: 'job-4',
    title: 'UP Police Constable 2026 Recruitment Online Form',
    slug: 'up-police-constable-2026-recruitment',
    shortDescription: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) invites application for Constable Recruitment. Total 60,244 vacancies. 12th Pass Eligible.',
    content: `## Uttar Pradesh (UP) Police Constable Cadet Online Form 2026
UP Police Recruitment & Promotion Board (PRPB - UPPRPB) is inviting online applications for recruitment of civilian police constables in Uttar Pradesh.

### Physical Parameters Requirement:
- **Height Male Gen/OBC/SC**: 168 cm | **ST**: 160 cm
- **Height Female Gen/OBC/SC**: 152 cm | **ST**: 147 cm
- **Male Running Run**: 4.8 KM under 25 Minutes
- **Female Running Run**: 2.4 KM under 14 Minutes`,
    category: 'police',
    tags: ['UP Police', 'Constable', 'State Govt', '12th Pass Jobs'],
    department: 'State PSC (Uttar Pradesh UPPSC)',
    state: 'Uttar Pradesh',
    qualification: '12th Pass',
    orgName: 'UPPRPB',
    experience: 'Fresher',
    lastDate: '2026-07-10',
    importantDates: [
      { event: 'Notification Released', date: '2026-05-30' },
      { event: 'Application Apply Starts', date: '2026-06-08' },
      { event: 'Last Date of Application', date: '2026-07-10' },
      { event: 'UP Police Constable Exam Date', date: 'September 2026' }
    ],
    eligibility: 'Candidate must have successfully passed 10+2 Intermediate Board Examination from any recognized Board in India.',
    applicationFees: [
      { category: 'All Categories (Gen / OBC / SC / ST / Women)', amount: '₹400' }
    ],
    importantLinks: [
      { label: 'Register UPPRPB Recruit Portal', url: 'https://uppbpb.gov.in', isExternal: true },
      { label: 'Download Complete Physical Criteria Syllabus', url: 'https://uppbpb.gov.in', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-05-30T11:00:00Z',
    downloads: 980,
    views: 3100
  },
  {
    id: 'job-5',
    title: 'SBI PO 2026 Notification - Probationary Officers Post',
    slug: 'sbi-po-2026-notification',
    shortDescription: 'State Bank of India (SBI) is hiring for Probationary Officers (PO) for 2,000 national positions. High scale salary structure. Apply Online.',
    content: `## State Bank of India (SBI) - Probationary Officer (PO) Batch 2026
State Bank of India has announced the recruitment of highly driven Indian citizens to execute the duty of Probationary Officers (PO).

### Recruitment Procedure
Selection is conducted in a three-stage competitive program:
1. **Phase-I**: Preliminary Examination (Objective type - 100 Marks online)
2. **Phase-II**: Main Examination (Objective + Descriptive online test - 250 Marks)
3. **Phase-III**: Psychometric Test + Group Exercise (20 Marks) & Interview (30 Marks)`,
    category: 'bank',
    tags: ['Bank', 'SBI', 'PO', 'Graduate Jobs'],
    department: 'Institute of Banking Personnel Selection (IBPS)',
    state: 'All India',
    qualification: 'Graduate',
    orgName: 'SBI',
    experience: 'Fresher',
    lastDate: '2026-06-30',
    importantDates: [
      { event: 'Notification Out', date: '2026-05-20' },
      { event: 'Apply Portal Start Date', date: '2026-06-01' },
      { event: 'Last Date for Online Registration', date: '2026-06-30' },
      { event: 'Prelims Examination Period', date: 'August 2026' },
      { event: 'Mains Examination Period', date: 'October 2026' }
    ],
    eligibility: 'Graduation degree in any discipline from a recognized University or any equivalent qualification recognized as such by the Central Government.',
    applicationFees: [
      { category: 'General / EWS / OBC Candidates', amount: '₹750' },
      { category: 'SC / ST / PwD Candidates', amount: '₹0 (Exempted)' }
    ],
    importantLinks: [
      { label: 'SBI Careers Applicant Portal', url: 'https://bank.sbi/careers', isExternal: true },
      { label: 'Download Model SBI Prelims Papers', url: 'https://bank.sbi', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-05-20T09:00:00Z',
    downloads: 1200,
    views: 5300
  },
  {
    id: 'job-6',
    title: 'Indian Army Agniveer Rally Recruitment 2026 Scheme',
    slug: 'indian-army-agniveer-rally-2026',
    shortDescription: 'Join Indian Army Agniveer General Duty, Clerk, Technical and Tradesman Rally 2026. Age limit 17.5 to 21 years. Apply now.',
    content: `## Join Indian Army (Agnipath Scheme Entry) 2026
Online Applications are invited from eligible male and female candidates for enlistment under the Agnipath scheme as Agniveers on Indian Army training centers.

### Branches Open for Registration:
- **Agniveer (General Duty) (GD)**
- **Agniveer (Technical) (All Arms)**
- **Agniveer (Clerk / Store Keeper Technical)**
- **Agniveer (Tradesmen 10th Pass & 8th Pass)**`,
    category: 'defence',
    tags: ['Agniveer', 'Indian Army', '10th Pass Jobs', '12th Pass Jobs'],
    department: 'Indian Army',
    state: 'All India',
    qualification: '10th Pass',
    orgName: 'Agniveer',
    experience: 'Fresher',
    lastDate: '2026-07-02',
    importantDates: [
      { event: 'Scheme Notification Released', date: '2026-06-02' },
      { event: 'Apply Online Start', date: '2026-06-05' },
      { event: 'Last Date of Form Submition', date: '2026-07-02' },
      { event: 'Online Common Entrance Exam (CEE)', date: 'September 2026' }
    ],
    eligibility: 'Class 10th Matriculation or 12th Intermediate pass depending on the branch profile, with required average score guidelines. Physical height minimum metrics based on regional state zones.',
    applicationFees: [
      { category: 'All Registered Candidates', amount: '₹250' }
    ],
    importantLinks: [
      { label: 'Join Indian Army Official Link', url: 'https://joinindianarmy.nic.in', isExternal: true },
      { label: 'Mock Practice Test Portal for Army CEE', url: 'https://joinindianarmy.nic.in', isExternal: true }
    ],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-06-02T12:00:00Z',
    downloads: 1980,
    views: 6710
  }
];

export const INITIAL_ADMIT_CARDS: AdmitCard[] = [
  {
    id: 'admit-1',
    title: 'UPSC Civil Services Prelims Admit Card 2026',
    slug: 'upsc-civil-services-prelims-admit-card-2026',
    jobId: 'job-1',
    releaseDate: '2026-06-01',
    examDate: '2026-09-20',
    admitCardUrl: 'https://upsconline.nic.in',
    instructions: 'Candidates must carry their original ID Card (Aadhar Card, PAN Card or Driving license) and 2 passport photos along with the printed Admit Card to the allocated examination center.',
    views: 4120,
    downloads: 3000,
    createdAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 'admit-2',
    title: 'SSC Junior Engineer (JE) Tier-1 Call Letter 2026',
    slug: 'ssc-junior-engineer-je-admit-card-2026',
    releaseDate: '2026-06-03',
    examDate: '2026-06-25',
    admitCardUrl: 'https://ssc.gov.in',
    instructions: 'Read instructions on reporting code timings. No electronic devices, wristwatches, or calculators are permitted inside the examination hall.',
    views: 2900,
    downloads: 1950,
    createdAt: '2026-06-03T11:00:00Z'
  },
  {
    id: 'admit-3',
    title: 'NTA UGC NET Exam Admit Card June Session 2026',
    slug: 'ugc-net-admit-card-june-2026',
    releaseDate: '2026-06-05',
    examDate: '2026-06-18',
    admitCardUrl: 'https://ugcnet.nta.nic.in',
    instructions: 'Strictly check your assigned shift details and roll credentials. Read specific social distancing guidelines outlined under annexures.',
    views: 1200,
    downloads: 840,
    createdAt: '2026-06-05T08:00:00Z'
  }
];

export const INITIAL_RESULTS: JobResult[] = [
  {
    id: 'result-1',
    title: 'UPSC CSE 2025 Final Marks & Merit List PDF',
    slug: 'upsc-civil-services-2025-final-result-declared',
    jobId: 'job-1',
    releaseDate: '2026-05-18',
    meritListUrl: 'https://upsc.gov.in',
    cutOffUrl: 'https://upsc.gov.in',
    officialResultUrl: 'https://upsc.gov.in',
    views: 8900,
    downloads: 6500,
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'result-2',
    title: 'SBI Clerk Phase 2 (Mains) Exam Sarkari Result 2026',
    slug: 'sbi-clerk-mains-sarkari-result-2026',
    releaseDate: '2026-06-02',
    meritListUrl: 'https://bank.sbi/careers',
    officialResultUrl: 'https://bank.sbi/careers',
    views: 5400,
    downloads: 3800,
    createdAt: '2026-06-02T13:00:00Z'
  },
  {
    id: 'result-3',
    title: 'SSC GD Constable Written Examination List of Qualified Candidates 2026',
    slug: 'ssc-gd-constable-written-result-2026',
    releaseDate: '2026-06-04',
    meritListUrl: 'https://ssc.gov.in',
    officialResultUrl: 'https://ssc.gov.in',
    views: 12500,
    downloads: 9400,
    createdAt: '2026-06-04T12:30:00Z'
  }
];

export const INITIAL_ANSWER_KEYS: AnswerKey[] = [
  {
    id: 'key-1',
    title: 'SSC CHSL 10+2 Tier 1 Answer Key & Challenge Link',
    slug: 'ssc-chsl-tier-1-answer-key-2026',
    releaseDate: '2026-05-28',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    officialUrl: 'https://ssc.gov.in',
    views: 8400,
    createdAt: '2026-05-28T14:00:00Z'
  },
  {
    id: 'key-2',
    title: 'UPSC NDA / NA I 2026 Official Answer Keys (Mathematics & GAT)',
    slug: 'upsc-nda-1-answer-key-2026',
    releaseDate: '2026-06-03',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    officialUrl: 'https://upsc.gov.in',
    views: 3100,
    createdAt: '2026-06-03T10:00:00Z'
  }
];

export const INITIAL_SYLLABUS: Syllabus[] = [
  {
    id: 'syll-1',
    title: 'SSC CGL detailed syllabus and examination pattern PDF',
    slug: 'ssc-cgl-exam-syllabus-pdf',
    jobId: 'job-2',
    examPatternDetail: 'Four Tiered Online CBT containing Quantitative Aptitude, English Reasoning, General Intelligence, and General Awareness.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    views: 4500,
    createdAt: '2026-05-20T08:00:00Z'
  },
  {
    id: 'syll-2',
    title: 'RRB NTPC Syllabus PDF download - Graduate Post pattern',
    slug: 'rrb-ntpc-graduate-syllabus-pattern',
    jobId: 'job-3',
    examPatternDetail: 'Stage 1 CBT consists of 100 General Awareness, General Intelligence, and Math questions. Stage 2 CBT features 120 questions.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    views: 5200,
    createdAt: '2026-06-02T15:00:00Z'
  }
];

export const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad-head',
    location: 'header',
    type: 'image',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=120',
    redirectUrl: '#',
    active: true
  },
  {
    id: 'ad-side',
    location: 'sidebar',
    type: 'image',
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300&h=600',
    redirectUrl: '#',
    active: true
  },
  {
    id: 'ad-content',
    location: 'in-content',
    type: 'image',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800&h=100',
    redirectUrl: '#',
    active: true
  },
  {
    id: 'ad-foot',
    location: 'footer',
    type: 'image',
    bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200&h=150',
    redirectUrl: '#',
    active: true
  }
];

export const TRENDING_NEWS = [
  "🔥 UPSC CSE 2026 Official Notification is Out now! Fill out OTR forms before July 15.",
  "🚀 RRB NTPC Graduate recruitment starts detailed regional registrations with 11,500+ active opening posts.",
  "📢 SSC Combined Graduate Level (CGL) 2026 dates confirmed. Tier-I exam to begin October 2026.",
  "⚡ UP Constable physical tests postponed to late August 2026 due to weather regulations.",
  "🎓 SBI Probationary Officer 2,000+ national level slots released with upgraded tier starting basic pay scales."
];
