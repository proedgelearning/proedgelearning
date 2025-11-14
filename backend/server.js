// server.js (ESM version)
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';            // <-- added
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const { Client } = pkg; // Extract Client from pg

const app = express();
app.use(bodyParser.json());

// ---- CORS configuration ----
// Allow specifying allowed origins via env, fallback to common values.
// Set FRONTEND_ORIGIN env to add your deployed frontend (e.g. https://your-frontend.com)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const EXTRA_ORIGINS = process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',') : [];
const allowedOrigins = [FRONTEND_ORIGIN, ...EXTRA_ORIGINS].filter(Boolean);

// Use a function to allow multiple origins and to allow credentials
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Ensure preflight requests are handled
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

/* ---------- rest of file ---------- */

// Environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_long_secret';
const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE
  ? parseInt(process.env.COOKIE_MAX_AGE, 10)
  : 7 * 24 * 3600; // 7 days

if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

// PostgreSQL connection
const pg = new Client({ connectionString: DATABASE_URL });
await pg.connect();

/* ---- Helpers ---- */

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function getTokenFromReq(req) {
  const header = req.headers.cookie;
  if (!header) return null;
  const cookies = cookie.parse(header || '');
  return cookies[COOKIE_NAME];
}

async function requireAdmin(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const q = await pg.query(
    'SELECT id, email, username FROM admins WHERE id=$1',
    [decoded.adminId]
  );

  if (!q.rows.length)
    return res.status(401).json({ error: 'Admin not found' });

  req.admin = q.rows[0];
  next();
}

/* ---- Admin Auth ---- */

// Login
app.post('/api/admin/login', async (req, res) => {
  const { emailOrUsername, password } = req.body || {};
  if (!emailOrUsername || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  const q = await pg.query(
    'SELECT id, email, username, password FROM admins WHERE email=$1 OR username=$1 LIMIT 1',
    [emailOrUsername]
  );

  if (!q.rows.length)
    return res.status(401).json({ error: 'Invalid credentials' });

  const admin = q.rows[0];
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid)
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ adminId: admin.id, email: admin.email });

  const cookieStr = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });

  res.setHeader('Set-Cookie', cookieStr);
  res.json({
    success: true,
    admin: { id: admin.id, email: admin.email, username: admin.username },
  });
});

// Logout
app.post('/api/admin/logout', (req, res) => {
  const cookieStr = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', cookieStr);
  res.json({ success: true });
});

// Who am I
app.get('/api/admin/me', async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const q = await pg.query(
    'SELECT id, email, username FROM admins WHERE id=$1',
    [decoded.adminId]
  );

  if (!q.rows.length)
    return res.status(401).json({ error: 'Admin not found' });

  res.json({ admin: q.rows[0] });
});

/* ---- Students CRUD (Protected) ---- */

// List
app.get('/api/students', requireAdmin, async (req, res) => {
  const q = await pg.query('SELECT * FROM students ORDER BY id DESC');
  res.json({ students: q.rows });
});

// Create
// app.post('/api/students', requireAdmin, async (req, res) => {
app.post('/api/students', async (req, res) => {
  const data = req.body || {};

  const allowed = [
    'full_name',
    'dob',
    'gender',
    'contact',
    'email',
    'address',
    'education_level',
    'school',
    'board',
    'subjects',
    'preferred_courses',
    'other_course',
    'batch_timing',
    'emergency_name',
    'emergency_relation',
    'emergency_phone',
  ];

  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  if (!keys.length)
    return res.status(400).json({ error: 'No fields provided' });

  const cols = keys.join(',');
  const params = keys.map((_, i) => `$${i + 1}`).join(',');
  const values = keys.map((k) => data[k]);

  const sql = `INSERT INTO students (${cols}) VALUES (${params}) RETURNING *`;
  const q = await pg.query(sql, values);

  res.status(201).json({ student: q.rows[0] });
});

// Get by ID
app.get('/api/students/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const q = await pg.query('SELECT * FROM students WHERE id=$1', [id]);

  if (!q.rows.length)
    return res.status(404).json({ error: 'Not found' });

  res.json({ student: q.rows[0] });
});

// Update
app.put('/api/students/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const data = req.body || {};

  const allowed = [
    'full_name',
    'dob',
    'gender',
    'contact',
    'email',
    'address',
    'education_level',
    'school',
    'board',
    'subjects',
    'preferred_courses',
    'other_course',
    'batch_timing',
    'emergency_name',
    'emergency_relation',
    'emergency_phone',
  ];

  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  if (!keys.length)
    return res.status(400).json({ error: 'No fields to update' });

  const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => data[k]);
  values.push(id);

  const sql = `UPDATE students SET ${sets} WHERE id = $${values.length} RETURNING *`;
  const q = await pg.query(sql, values);

  if (!q.rows.length)
    return res.status(404).json({ error: 'Not found' });

  res.json({ student: q.rows[0] });
});

// Delete
app.delete('/api/students/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  await pg.query('DELETE FROM students WHERE id=$1', [id]);
  res.status(204).end();
});

/* ---- Start Server ---- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
