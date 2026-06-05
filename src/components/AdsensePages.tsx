/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertTriangle, Scale, Info, ShieldAlert, Award } from 'lucide-react';

interface AdsensePagesProps {
  pagePath: string;
  onNavigate: (path: string) => void;
}

export default function AdsensePages({ pagePath, onNavigate }: AdsensePagesProps) {
  // Setup contact form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSendState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSendState('success');
        setStatusMsg(data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSendState('error');
        setStatusMsg(data.error || 'Check fields and submit again.');
      }
    } catch {
      setSendState('error');
      setStatusMsg('Network is unreachable. Simulated message store error.');
    }
  };

  // Helper title wrapper for policy docs
  const pageHeader = (title: string, subtitle: string, Icon: any) => (
    <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 rounded-3xl mb-10">
      <div className="inline-flex p-3.5 bg-brand-500 rounded-2xl text-white shadow-lg mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
        {title}
      </h2>
      <p className="font-sans text-sm md:text-base text-gray-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );

  if (pagePath === '/about') {
    return (
      <div id="about-us-page" className="max-w-4xl mx-auto px-4 py-8">
        {pageHeader("About Sarkari Career Hub", "Empowering Indian government job aspirants with swift, reliable info summaries.", Info)}
        <div className="prose dark:prose-invert text-gray-600 dark:text-slate-300 max-w-none space-y-6">
          <p className="font-sans leading-relaxed text-base">
            Welcome to <strong>Sarkari Career Hub</strong>, India&apos;s premium modern educational index for central and state government job opportunities. Traditional portals are often clogged with complex structures, heavy scripts, and invasive overlays. We built Sarkari Career Hub to revolutionize job cataloging: combining <strong>elegant typography</strong>, <strong>high contrast layout safety</strong>, and <strong>fast-loading direct embedded PDF previews</strong>.
          </p>

          <h3 className="font-display text-xl font-bold dark:text-white pt-4">Our Core Philosophy</h3>
          <p className="font-sans leading-relaxed text-sm">
            Our sole directive is candidates safety and awareness. Millions of students waste essential study hours navigating unreliable channels. Our editorial staff aggregates verified board announcements directly from official sites (UPSC, SSC, Railway Board, State Commissions, IBPS) and indexes them into immediate search-friendly listings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-center">
              <span className="text-2xl">⚡</span>
              <h4 className="font-display font-bold mt-2 dark:text-white text-sm">Aggressive Speed</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Lightweight server response with static file compression.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-center">
              <span className="text-2xl">👁️</span>
              <h4 className="font-display font-bold mt-2 dark:text-white text-sm">Live PDF Viewer</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Browse official commission schedules inside the alert instantly.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-center">
              <span className="text-2xl">🛡️</span>
              <h4 className="font-display font-bold mt-2 dark:text-white text-sm">Verify First</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Direct reference official download links for extreme safety.</p>
            </div>
          </div>

          <h3 className="font-display text-xl font-bold dark:text-white pt-2">Compliance Statement</h3>
          <p className="font-sans leading-relaxed text-sm">
            Sarkari Career Hub is a private digital database. We <strong>do not represent</strong>, pretend to be, or act as an official agency of the Government of India or any state cabinet. Every alert compiles the source URLs of respective board portals. Aspirants are advised to double-check parameters before executing applications.
          </p>
        </div>
      </div>
    );
  }

  if (pagePath === '/contact') {
    return (
      <div id="contact-us-page" className="max-w-5xl mx-auto px-4 py-8">
        {pageHeader("Contact Support Center", "Get in touch with the Sarkari Career Hub editorial staff.", Mail)}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Panels */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800">
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-brand-500" />
                <span>Email Enquiries</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                Send feedback, notification updates, or advertising questions directly. We reply in 24 hours.
              </p>
              <a href="mailto:support@sarkaricareerhub.com" className="text-sm font-semibold text-brand-600 block mt-2 hover:underline">
                support@sarkaricareerhub.com
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800">
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>DMCA Redressal</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                Need removal of indexed PDF sheets due to copy safety rules? Check our DMCA procedure.
              </p>
              <button onClick={() => onNavigate('/policy/dmca')} className="text-sm font-semibold text-brand-600 block mt-2 hover:underline text-left">
                View DMCA Takedown Form
              </button>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 shadow-xl">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">
              Send Direct Communication
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name" 
                    className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-850 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com" 
                    className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-850 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Job correction or business proposal" 
                  className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-850 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Detailed Message</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you want to share..." 
                  className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-850 bg-gray-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={sendState === 'sending'}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  {sendState === 'sending' ? 'Submitting Communication...' : 'Submit Message'}
                </button>
              </div>
            </form>

            {sendState === 'success' && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/35 border border-green-200 dark:border-green-900/60 flex items-center gap-3 text-green-700 dark:text-green-300 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p>{statusMsg}</p>
              </div>
            )}
            {sendState === 'error' && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/35 border border-red-200 dark:border-red-900/60 flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{statusMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Define simple mock content map for other policy documents
  const policyTitleMap: Record<string, { title: string; desc: string; icon: any; content: string }> = {
    '/policy/privacy': {
      title: 'Privacy Policy',
      desc: 'Learn how we collect, process, and protect your data securely.',
      icon: Scale,
      content: `At Sarkari Career Hub, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sarkari Career Hub and how we use it.

### Log Files
Sarkari Career Hub follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (address, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.

### Cookies and Web Beacons
Like any other website, Sarkari Career Hub uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

### Google AdSense and DoubleClick Bulletins
Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.`
    },
    '/policy/terms': {
      title: 'Terms & Conditions',
      desc: 'General guidelines governing utilization of our information portals.',
      icon: Scale,
      content: `Welcome to Sarkari Career Hub! These terms and conditions outline the rules and regulations for the use of Sarkari Career Hub's Website.

By accessing this website we assume you accept these terms and conditions. Do not continue to use Sarkari Career Hub if you do not agree to take all of the terms and conditions stated on this page.

### License Requirements
Unless otherwise stated, Sarkari Career Hub and/or its licensors own the intellectual property rights for all material on Sarkari Career Hub. All intellectual property rights are reserved. You may access this from Sarkari Career Hub for your own personal use subjected to restrictions set in these terms and conditions.

### Content Liability
We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.`
    },
    '/policy/disclaimer': {
      title: 'General Disclaimer',
      desc: 'Our administrative disclaimer on official governmental relationships.',
      icon: AlertTriangle,
      content: `All the information on this website - https://sarkaricareerhub.com - is published in good faith and for general information purpose only. Sarkari Career Hub does not make any warranties about the completeness, reliability and accuracy of this information.

### Governal Affiliation Zero Bond
**CRITICAL NOTIFICATION**: Sarkari Career Hub is a private enterprise. We have **ZERO relationship** with any central, state, municipal government agency, PSC board, or central board. We do not provide jobs, release official qualifications, or hold examinations. 

### External Links Caution
From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.`
    },
    '/policy/dmca': {
      title: 'DMCA Copyright Policy',
      desc: 'Safe harbor copyright removal procedures for indexed documents.',
      icon: ShieldAlert,
      content: `Our system respects intellectual property. All government PDF notifications index on these pages are public alerts shared by official recruitment commissions for wide distribution. However, if you are a copyright owner and wish to trigger the safe harbor removal guidelines, please follow our policy.

### Submitting a Takedown request:
Please send an email detailing the following to **dmca@sarkaricareerhub.com**:
1. Specific title of pages containing copyright allegations.
2. Direct URLs linking to respective posts.
3. Proof confirming your administrative holding power.

We act on standard requests within 48-72 business hours.`
    },
    '/policy/editorial': {
      title: 'Editorial Policy',
      desc: 'Guidelines defining formatting and verification of alerts.',
      icon: Award,
      content: `We prioritize high fidelity and transparency. Every alert must meet strict editorial criteria:
- **Origin verification**: Double audit source files using direct official domains (.gov.in or .nic.in).
- **Format parity**: Transcribe tables (Important Dates, eligibility rules, application fees) exactly as declared in the source catalog.
- **Accessible preview**: Provide reliable direct embedded viewing models.`
    },
    '/policy/cookie': {
      title: 'Cookie Policy',
      desc: 'How browser cookies optimize layouts for our visitors.',
      icon: Scale,
      content: `Sarkari Career Hub uses small text packages called cookies to:
- Learn light-dark theme preference values.
- Persist bookmark cards safely on client browser caches.
- Render tailored advertisement blocks across responsive rails.`
    }
  };

  const activePolicy = policyTitleMap[pagePath];

  if (activePolicy) {
    const ActiveIcon = activePolicy.icon;
    return (
      <div id="policy-content" className="max-w-4xl mx-auto px-4 py-8">
        {pageHeader(activePolicy.title, activePolicy.desc, ActiveIcon)}
        <div className="prose dark:prose-invert text-gray-600 dark:text-slate-300 max-w-none space-y-6">
          {activePolicy.content.split('\n\n').map((para, i) => {
            if (para.startsWith('### ')) {
              return <h3 key={i} className="font-display text-xl font-bold dark:text-white pt-4">{para.replace('### ', '')}</h3>;
            }
            if (para.startsWith('**')) {
              return <p key={i} className="font-sans leading-relaxed text-sm border-l-4 border-amber-500 pl-4 py-1.5 bg-amber-500/5 text-amber-800 dark:text-amber-200 rounded">{para.replace(/\*\*/g, '')}</p>;
            }
            return <p key={i} className="font-sans leading-relaxed text-sm whitespace-pre-line">{para}</p>;
          })}
        </div>
      </div>
    );
  }

  // Error page fallback
  return (
    <div className="text-center py-20">
      <h3 className="font-display text-2xl font-black text-gray-950 dark:text-white">Page Not Found</h3>
      <button onClick={() => onNavigate('/')} className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg">Return Home</button>
    </div>
  );
}
