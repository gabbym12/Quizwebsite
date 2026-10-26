# Gabby Football Quiz App 🏈

Interactive football trivia platform built on **Node.js 24 LTS + Express 5 + Replit PostgreSQL**.

**Current status:** Phase 1 — Foundation & DB Setup ✅

See [SPEC-v4.md](./SPEC-v4.md) for the full technical specification.

## Roadmap

1. ✅ Phase 1 — Foundation & DB Setup (Express server, pg pool, migrations, static hosting)
2. ⬜ Phase 2 — Authentication & RBAC (bcrypt, sessions, player/admin roles)
3. ⬜ Phase 3 — Core Quiz Engine & Instant Feedback (5 football quizzes, timer, auto-submit)
4. ⬜ Phase 4 — History & Leaderboards (attempts, My History, leaderboards)
5. ⬜ Phase 5 — Admin Tools & Deployment (question editor, CSV import, QA, deploy)

## Development

All work happens on the \`feature/quiz-app-specification\` branch — never on \`main\`.

\`\`\`bash
npm install
npm run migrate   # create/refresh database tables
npm start         # start the Express server
\`\`\`

On Replit: enable the PostgreSQL database (DATABASE_URL is injected automatically), then run migrations from the shell.
