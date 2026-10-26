// db/seedAdmin.js - creates or updates the admin account
// Usage: npm run seed-admin
//   (uses env vars ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_EMAIL if set, else defaults below)
import bcrypt from 'bcryptjs';
import { pool, query } from './index.js';

const username = process.env.ADMIN_USERNAME || 'admin';
const email = process.env.ADMIN_EMAIL || 'admin@gabbyquiz.local';
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

async function seedAdmin() {
  try {
    const hash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (username) DO UPDATE SET role = 'admin', password_hash = EXCLUDED.password_hash`,
      [username, email, hash]
    );
    console.log('Admin account ready:', username, '- role: admin');
    console.log('NOTE: change this password before real use (set ADMIN_PASSWORD env var).');
  } catch (err) {
    console.error('Seed admin failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedAdmin();
