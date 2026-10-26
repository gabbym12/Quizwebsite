// routes/quizzes.js - Phase 3: quiz engine endpoints
import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from './auth.js';

export const quizzesRouter = Router();

// GET /api/quizzes - list all active quizzes (logged-in users only)
quizzesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, title, category, description FROM quizzes ORDER BY id'
    );
    res.json({ quizzes: rows });
  } catch (err) {
    console.error('list quizzes error:', err);
    res.status(500).json({ error: 'Could not load quizzes.' });
  }
});

// GET /api/quizzes/:id/questions - questions for one quiz
quizzesRouter.get('/:id/questions', requireAuth, async (req, res) => {
  try {
    const quizId = Number(req.params.id);
    const quiz = await query('SELECT id, title FROM quizzes WHERE id = $1', [quizId]);
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Quiz not found.' });

    const { rows } = await query(
      'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation FROM questions WHERE quiz_id = $1 ORDER BY id',
      [quizId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'This quiz has no questions yet.' });

    res.json({
      quiz: quiz.rows[0],
      questions: rows.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        correct_option: q.correct_option,
        explanation: q.explanation,
      })),
    });
  } catch (err) {
    console.error('questions error:', err);
    res.status(500).json({ error: 'Could not load questions.' });
  }
});

// POST /api/quizzes/:id/attempt - record a completed attempt (used by submit & auto-submit)
quizzesRouter.post('/:id/attempt', requireAuth, async (req, res) => {
  try {
    const quizId = Number(req.params.id);
    const { score, total_questions } = req.body ?? {};

    const quiz = await query('SELECT id FROM quizzes WHERE id = $1', [quizId]);
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Quiz not found.' });

    const s = Number(score), t = Number(total_questions);
    if (!Number.isInteger(s) || !Number.isInteger(t) || t <= 0 || s < 0 || s > t) {
      return res.status(400).json({ error: 'Invalid score payload.' });
    }

    const { rows } = await query(
      'INSERT INTO attempts (user_id, quiz_id, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING id, score, total_questions, completed_at',
      [req.session.userId, quizId, s, t]
    );
    res.status(201).json({ attempt: rows[0] });
  } catch (err) {
    console.error('attempt error:', err);
    res.status(500).json({ error: 'Could not save your attempt.' });
  }
});
