const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.APP_PASSWORD || '888';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const SESSION_SECRET = process.env.SESSION_SECRET || 'zr-shooting-plan-secret-key-2026';
const DATA_FILE = path.join(DATA_DIR, 'plan.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function readData() {
  if (!fs.existsSync(DATA_FILE)) return { data: null, updated_at: 0 };
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('readData failed:', e);
    return { data: null, updated_at: 0 };
  }
}
function writeData(payload) {
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `plan-${stamp}.json`);
    fs.copyFileSync(DATA_FILE, backupFile);
    const backups = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('plan-')).sort();
    while (backups.length > 20) {
      fs.unlinkSync(path.join(BACKUP_DIR, backups.shift()));
    }
  } catch (e) {
    console.warn('backup failed:', e.message);
  }
}

function makeToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}
function verifyToken(token) {
  if (!token) return false;
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  if (sig !== expected) return false;
  if (Date.now() > parseInt(payload, 10)) return false;
  return true;
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ---- API routes (registered FIRST) ----
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password === PASSWORD) {
    res.cookie('zr_session', makeToken(), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: '密码错误' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('zr_session');
  res.json({ ok: true });
});

function requireAuth(req, res, next) {
  if (!verifyToken(req.cookies?.zr_session)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  next();
}

app.get('/api/data', requireAuth, (req, res) => {
  const stored = readData();
  res.json({ ok: true, data: stored.data, updated_at: stored.updated_at });
});

app.put('/api/data', requireAuth, (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid data' });
  }
  const now = Date.now();
  writeData({ data, updated_at: now });
  res.json({ ok: true, updated_at: now });
});

app.get('/api/me', (req, res) => {
  res.json({ authenticated: verifyToken(req.cookies?.zr_session) });
});

app.get('/api/export', requireAuth, (req, res) => {
  const stored = readData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="zr-plan-${Date.now()}.json"`);
  res.send(JSON.stringify(stored, null, 2));
});

// ---- Root redirect: if not authed, send to login page ----
app.get('/', (req, res, next) => {
  if (!verifyToken(req.cookies?.zr_session)) {
    return res.redirect('/login.html');
  }
  // Authed: serve index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- Static files (login.html, app.js, etc.) ----
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`zr-shooting-plan listening on :${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
