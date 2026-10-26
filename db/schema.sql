-- db/schema.sql - Gabby Football Quiz App relational schema (Draft v4, Section 7)
-- Idempotent migration: safe to run repeatedly.

-- users: registered players and admins
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'player',
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_check CHECK (role IN ('player', 'admin'))
);

-- quizzes: the five active football quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150) NOT NULL UNIQUE,
  category    VARCHAR(100) NOT NULL,
  description TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- questions: four-choice questions belonging to a quiz
CREATE TABLE IF NOT EXISTS questions (
  id            SERIAL PRIMARY KEY,
  quiz_id       INT         NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT        NOT NULL,
  option_a      TEXT        NOT NULL,
  option_b      TEXT        NOT NULL,
  option_c      TEXT        NOT NULL,
  option_d      TEXT        NOT NULL,
  correct_option CHAR(1)    NOT NULL,
  explanation   TEXT        NOT NULL,
  created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
  CONSTRAINT questions_correct_option_check CHECK (correct_option IN ('A', 'B', 'C', 'D'))
);

-- attempts: one row per completed quiz attempt
CREATE TABLE IF NOT EXISTS attempts (
  id              SERIAL PRIMARY KEY,
  user_id         INT      NOT NULL REFERENCES users(id),
  quiz_id         INT      NOT NULL REFERENCES quizzes(id),
  score           INT      NOT NULL,
  total_questions INT      NOT NULL,
  completed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT attempts_score_check CHECK (score >= 0 AND total_questions > 0 AND score <= total_questions)
);

-- Helpful indexes for leaderboard queries (Phase 4)
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz ON attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_score ON attempts(quiz_id, score DESC);
