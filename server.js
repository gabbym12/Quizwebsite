// server.js - Gabby Football Quiz App
// Phase 1: Foundation | Phase 2: Auth & RBAC | Phase 3: Quiz Engine | Phase 4: History & Leaderboards
import express from 'express';
import session from 'express-session';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { testConnection } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { quizzesRouter } from './routes/quizzes.js';
import { historyRouter, leaderboardRouter } from './routes/stats.js';
import { attachRole } from './middleware/role.js';
import { requireAuth, requireAdmin } from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'gabby_quiz_sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: !!process.env.REPLIT_DEV_DOMAIN,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use(attachRole);

// --- Static assets ---
app.use(express.static(path.join(__dirname, 'public')));

// --- APIs ---
app.use('/api/auth', authRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/history', historyRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Admin-only (Question Editor arrives in Phase 5)
app.get('/api/admin/ping', requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin! Question Editor arrives in Phase 5.' });
});

// --- Health ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', phase: 4 }));
app.get('/api/db-health', async (req, res) => {
  try {
    const now = await testConnection();
    res.json({ status: 'ok', dbTime: now });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// --- Global error handler: clean JSON for API errors instead of a crash ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('unhandled error:', err);
  if (res.headersSent) return next(err);
  if (req.path && req.path.startsWith('/api')) {
    return res.status(503).json({ error: 'Service temporarily unavailable. Check the database connection.' });
  }
  res.status(500).send('Something went wrong.');
});

app.listen(PORT, () => {
  console.log(`Gabby Football Quiz App listening on port ${PORT}`);
});
