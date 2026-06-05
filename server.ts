/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_JOBS, INITIAL_ADMIT_CARDS, INITIAL_RESULTS, INITIAL_ANSWER_KEYS, INITIAL_SYLLABUS, INITIAL_ADS } from './src/data.js';

// Setup file-based local JSON database inside standard working directory files (persistent across session boots)
const DB_PATH = path.join(process.cwd(), 'db_store.json');

interface DBStore {
  jobs: any[];
  admitCards: any[];
  results: any[];
  answerKeys: any[];
  syllabus: any[];
  newsletters: any[];
  contactMessages: any[];
  ads: any[];
}

// Initial DB seed helper
function loadDB(): DBStore {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read local store db, seeding defaults instead.", error);
  }

  // Seed default data populated in our data file
  const defaultDB: DBStore = {
    jobs: INITIAL_JOBS,
    admitCards: INITIAL_ADMIT_CARDS,
    results: INITIAL_RESULTS,
    answerKeys: INITIAL_ANSWER_KEYS,
    syllabus: INITIAL_SYLLABUS,
    newsletters: [],
    contactMessages: [],
    ads: INITIAL_ADS
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: DBStore) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to persist local store db changes", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup upload asset directory
  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Increase body limit to support base64 uploading of large PDF / Images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static serving for admin uploaded documents / PDFs
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Initialize Data Store
  let dbStore = loadDB();

  // 1. API: Upload Files (Image/PDF Base64 parser)
  app.post('/api/upload', (req, res) => {
    try {
      const { fileName, fileContent } = req.body;
      if (!fileName || !fileContent) {
        return res.status(400).json({ error: 'Missing fileName or fileContent' });
      }

      // Strip general base64 wrapper prefix if exists
      const base64Data = fileContent.replace(/^data:application\/pdf;base64,/, '')
                                   .replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Clean target name to prevent directory traversals
      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      
      fs.writeFileSync(filePath, buffer);
      
      const fileUrl = `/uploads/${safeName}`;
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'File upload failure' });
    }
  });

  // 2. API: Portal Statistics
  app.get('/api/stats', (req, res) => {
    const totalViews = dbStore.jobs.reduce((sum, j) => sum + (j.views || 0), 0) + 
                       dbStore.admitCards.reduce((sum, a) => sum + (a.views || 0), 0) +
                       dbStore.results.reduce((sum, r) => sum + (r.views || 0), 0);
                       
    const totalDownloads = dbStore.jobs.reduce((sum, j) => sum + (j.downloads || 0), 0) + 
                           dbStore.admitCards.reduce((sum, a) => sum + (a.downloads || 0), 0) +
                           dbStore.results.reduce((sum, r) => sum + (r.downloads || 0), 0);

    res.json({
      totalJobs: dbStore.jobs.length,
      totalAdmitCards: dbStore.admitCards.length,
      totalResults: dbStore.results.length,
      totalViews,
      totalDownloads,
      totalSubscribers: dbStore.newsletters.length
    });
  });

  // 3. API: Jobs (CRUD)
  app.get('/api/jobs', (req, res) => {
    res.json(dbStore.jobs);
  });

  app.get('/api/jobs/:slug', (req, res) => {
    const job = dbStore.jobs.find(j => j.slug === req.params.slug);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    // Increment view count lazily
    job.views = (job.views || 0) + 1;
    saveDB(dbStore);
    res.json(job);
  });

  app.post('/api/jobs', (req, res) => {
    const newJob = {
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      downloads: 0,
      importantDates: req.body.importantDates || [],
      applicationFees: req.body.applicationFees || [],
      importantLinks: req.body.importantLinks || [],
      tags: req.body.tags || [],
      ...req.body
    };
    dbStore.jobs.unshift(newJob);
    saveDB(dbStore);
    res.status(201).json(newJob);
  });

  app.put('/api/jobs/:id', (req, res) => {
    const idx = dbStore.jobs.findIndex(j => j.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    dbStore.jobs[idx] = { ...dbStore.jobs[idx], ...req.body };
    saveDB(dbStore);
    res.json(dbStore.jobs[idx]);
  });

  app.delete('/api/jobs/:id', (req, res) => {
    dbStore.jobs = dbStore.jobs.filter(j => j.id !== req.params.id);
    saveDB(dbStore);
    res.json({ success: true });
  });

  app.post('/api/jobs/:id/download', (req, res) => {
    const job = dbStore.jobs.find(j => j.id === req.params.id);
    if (job) {
      job.downloads = (job.downloads || 0) + 1;
      saveDB(dbStore);
    }
    res.json({ success: true, downloads: job?.downloads || 0 });
  });

  // 4. API: Admit Cards
  app.get('/api/admits', (req, res) => {
    res.json(dbStore.admitCards);
  });

  app.post('/api/admits', (req, res) => {
    const newAdmit = {
      id: `admit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      downloads: 0,
      ...req.body
    };
    dbStore.admitCards.unshift(newAdmit);
    saveDB(dbStore);
    res.status(201).json(newAdmit);
  });

  app.delete('/api/admits/:id', (req, res) => {
    dbStore.admitCards = dbStore.admitCards.filter(a => a.id !== req.params.id);
    saveDB(dbStore);
    res.json({ success: true });
  });

  // 5. API: Results
  app.get('/api/results', (req, res) => {
    res.json(dbStore.results);
  });

  app.post('/api/results', (req, res) => {
    const newResult = {
      id: `result-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      downloads: 0,
      ...req.body
    };
    dbStore.results.unshift(newResult);
    saveDB(dbStore);
    res.status(201).json(newResult);
  });

  app.delete('/api/results/:id', (req, res) => {
    dbStore.results = dbStore.results.filter(r => r.id !== req.params.id);
    saveDB(dbStore);
    res.json({ success: true });
  });

  // 6. API: Answer Keys
  app.get('/api/keys', (req, res) => {
    res.json(dbStore.answerKeys);
  });

  app.post('/api/keys', (req, res) => {
    const newKey = {
      id: `key-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      ...req.body
    };
    dbStore.answerKeys.unshift(newKey);
    saveDB(dbStore);
    res.status(201).json(newKey);
  });

  app.delete('/api/keys/:id', (req, res) => {
    dbStore.answerKeys = dbStore.answerKeys.filter(k => k.id !== req.params.id);
    saveDB(dbStore);
    res.json({ success: true });
  });

  // 7. API: Syllabus
  app.get('/api/syllabus', (req, res) => {
    res.json(dbStore.syllabus);
  });

  app.post('/api/syllabus', (req, res) => {
    const newSyll = {
      id: `syllabus-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      ...req.body
    };
    dbStore.syllabus.unshift(newSyll);
    saveDB(dbStore);
    res.status(201).json(newSyll);
  });

  app.delete('/api/syllabus/:id', (req, res) => {
    dbStore.syllabus = dbStore.syllabus.filter(s => s.id !== req.params.id);
    saveDB(dbStore);
    res.json({ success: true });
  });

  // 8. API: Newsletter Signups
  app.get('/api/newsletters', (req, res) => {
    res.json(dbStore.newsletters);
  });

  app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    const alreadySubbed = dbStore.newsletters.some(n => n.email.toLowerCase() === email.toLowerCase());
    if (alreadySubbed) {
      return res.json({ success: true, message: 'Already subscribed!' });
    }
    dbStore.newsletters.push({
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString()
    });
    saveDB(dbStore);
    res.json({ success: true, message: 'Subscribed successfully!' });
  });

  // 9. API: Contact Messages
  app.get('/api/contacts', (req, res) => {
    res.json(dbStore.contactMessages);
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Required parameters missing' });
    }
    const newMsg = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || 'No General Subject',
      message,
      createdAt: new Date().toISOString()
    };
    dbStore.contactMessages.push(newMsg);
    saveDB(dbStore);
    // Simulate SMTP / direct sender success response
    res.json({ success: true, message: 'Your message has been stored. Admin will reply soon!' });
  });

  // 10. API: Ads Management
  app.get('/api/ads', (req, res) => {
    res.json(dbStore.ads);
  });

  app.put('/api/ads', (req, res) => {
    const { ads } = req.body;
    if (Array.isArray(ads)) {
      dbStore.ads = ads;
      saveDB(dbStore);
      return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid ads data' });
  });

  // Service health hook
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Vite development server middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA catch-all routing fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sarkari Career Hub] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to bootstrap Sarkari Career Hub custom server", err);
  process.exit(1);
});
