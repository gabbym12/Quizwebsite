// server.js - Gabby Football Quiz App
// Phase 1: Foundation & DB Setup | Phase 2: Authentication & RBAC
import express from 'express';
import session from 'express-session';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { testConnection } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { attachRole } from './middleware/role.js';
import { requireAuth, requireAdmin } from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session cookie auth
app.use(session({
  name: 'gabby_quiz_sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: !!process.env.REPLIT_DEV_DOMAIN,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
}));

// RBAC: resolve the user's role on every request
app.use(attachRole);

// --- Static assets ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Auth API (register / login / logout / me) ---
app.use('/api/auth', authRouter);

// --- RBAC demo endpoints ---
// Any logged-in user (player or admin)
app.get('/api/player/me', requireAuth, (req, res) => {
  res.json({ message: 'You are logged in.', role: req.sessionRole });
});

// Admin-only: returns 403 Forbidden for players (Question Editor link arrives in Phase 5)
app.get('/api/admin/ping', requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin! Question Editor arrives in Phase 5.' });
});

// --- Health / readiness endpoints ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', phase: 2 }));
app.get('/api/db-health', async (req, res) => {
  try {
    const now = await testConnection();
    res.json({ status: 'ok', dbTime: now });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

// Placeholder for later phases
app.get('/api/quizzes', (req, res) => res.json({ message: 'Not implemented yet - arriving in Phase 3.' }));

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Gabby Football Quiz App listening on port ${PORT}`);
});
