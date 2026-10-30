#!/usr/bin/env bash
set -euo pipefail

npm install --no-audit --no-fund --no-progress
npm run migrate
npm run seed-quizzes
