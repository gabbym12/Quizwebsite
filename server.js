// server.js - Gabby Football Quiz App, Phase 1: Foundation & DB Setup
// Monolithic Express server: serves static assets + REST JSON endpoints.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { testConnection } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Health / readiness endpoints ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', phase: 1 });
});

app.get('/api/db-health', async (req, res) => {
  try {
    const now = await testConnection();
    res.json({ status: 'ok', dbTime: now });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

// --- Placeholder for later phases ---
app.get('/api/quizzes', async (req, res) => {
  res.json({ message: 'Not implemented yet - arriving in Phase 3.' });
});

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Gabby Football Quiz App listening on port ${PORT}`);
});
