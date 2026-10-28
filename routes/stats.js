// routes/stats.js - Phase 4: attempt history & leaderboards
import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from './auth.js';

export const historyRouter = Router();
export const leaderboardRouter = Router();

// GET /api/history - current user's completed attempts (newest first)
historyRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT a.id, q.title AS quiz_title, a.score, a.total_questions,
              ROUND(a.score * 100.0 / a.total_questions)::int AS percentage,
              to_char(a.completed_at, 'Mon DD, YYYY HH12:MI AM') AS completed_at
       FROM attempts a JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.user_id = $1
       ORDER BY a.completed_at DESC`,
      [req.session.userId]
    );
    res.json({ history: rows });
  } catch (err) {
    console.error('history error:', err);
    res.status(500).json({ error: 'Could not load your history.' });
  }
});

// GET /api/leaderboard - Overall: ranked by total completed attempts.
// Tie-breaker: earliest timestamp of the most recent completed attempt.
leaderboardRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT u.username, COUNT(*)::int AS total_attempts,
              MAX(a.completed_at) AS last_attempt
       FROM attempts a JOIN users u ON u.id = a.user_id
       GROUP BY u.id, u.username
       ORDER BY total_attempts DESC, last_attempt ASC
       LIMIT 50`
    );
    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('overall leaderboard error:', err);
    res.status(500).json({ error: 'Could not load the leaderboard.' });
  }
});

// GET /api/leaderboard/quiz/:id - Per-quiz: ranked by high score.
// Tie-breakers: fewest attempts to reach the high score, then earliest achievement.
leaderboardRouter.get('/quiz/:id', requireAuth, async (req, res) => {
  try {
    const quizId = parseInt(req.params.id, 10);
    if (!Number.isInteger(quizId)) {
      return res.status(400).json({ error: 'Invalid quiz id.' });
    }
    const { rows } = await query(
      `WITH agg AS (
         SELECT a.user_id, MAX(a.score)::int AS high_score, COUNT(*)::int AS attempts
         FROM attempts a
         WHERE a.quiz_id = $1
         GROUP BY a.user_id
       )
       SELECT u.username, agg.high_score, agg.attempts,
              (SELECT MIN(a2.completed_at) FROM attempts a2
                WHERE a2.quiz_id = $1 AND a2.user_id = agg.user_id
                  AND a2.score = agg.high_score) AS achieved_at
       FROM agg JOIN users u ON u.id = agg.user_id
       ORDER BY agg.high_score DESC, agg.attempts ASC, achieved_at ASC
       LIMIT 50`,
      [quizId]
    );
    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('quiz leaderboard error:', err);
    res.status(500).json({ error: 'Could not load the quiz leaderboard.' });
  }
});
