// db/index.js - Replit PostgreSQL connection pool (pg client)
import pg from 'pg';

// Replit injects DATABASE_URL automatically; fall back to local dev default.
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/gabby_quiz';

export const pool = new pg.Pool({
  connectionString,
  // Replit requires SSL for managed Postgres; local dev usually does not.
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query(text, params = []) {
  // Parameterized queries exclusively - eliminates SQL injection.
  const start = Date.now();
  const result = await pool.query(text, params);
  const ms = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('db query', { text: text.slice(0, 80), ms, rows: result.rowCount });
  }
  return result;
}

export async function testConnection() {
  const { rows } = await query('SELECT NOW() AS now');
  return rows[0].now;
}
