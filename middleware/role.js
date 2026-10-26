// middleware/role.js - resolves the logged-in user's role per request
import { query } from '../db/index.js';

// Attaches req.sessionRole so requireAdmin can enforce RBAC.
export async function attachRole(req, res, next) {
  if (!req.session.userId) {
    req.sessionRole = null;
    return next();
  }
  try {
    const { rows } = await query('SELECT role FROM users WHERE id = $1', [req.session.userId]);
    req.sessionRole = rows[0]?.role ?? null;
    next();
  } catch (err) {
    next(err);
  }
}
