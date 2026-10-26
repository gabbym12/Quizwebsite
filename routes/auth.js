// routes/auth.js - Phase 2: Authentication (bcrypt + sessions)
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';

export const authRouter = Router();

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are all required.' });
    }
    if (!USERNAME_RE.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-30 characters (letters, numbers, underscores).' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
      [username, email, hash, 'player']
    );
    req.session.userId = rows[0].id;
    res.status(201).json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That username or email is already taken.' });
    }
    console.error('register error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    req.session.userId = user.id;
    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('gabby_quiz_sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me - current session user (frontend uses this on load)
authRouter.get('/me', async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const { rows } = await query('SELECT id, username, role FROM users WHERE id = $1', [req.session.userId]);
  res.json({ user: rows[0] ?? null });
});

// Middleware for routes that require a logged-in user
export function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Please log in.' });
  next();
}
