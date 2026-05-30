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

// ---- file-based storage with backup-on-write ----
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { data: null, updated_at: 0 };
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('readData failed (corruption?):', e.message);
    // SAFETY: if plan.json exists but cannot be parsed, do NOT report empty
    // (that would trigger client to seed and overwrite). Rename the bad file
    // and serve a "locked" sentinel that client treats as an error, not empty.
    try {
      const badName = `plan.corrupt-${Date.now()}.json`;
      fs.renameSync(DATA_FILE, path.join(DATA_DIR, badName));
      console.error('Renamed corrupt file to', badName);
    } catch (_) {}
    return { data: null, updated_at: 0, error: 'parse_failed' };
  }
}
function writeData(payload) {
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
  // Rolling backup (keep last 20)
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

// ---- session token ----
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

// ============ Backup recovery (temporary admin endpoints) ============
// List all backup files with size + parsed timestamp
app.get('/api/backups', requireAuth, (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return res.json({ ok: true, backups: [] });
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('plan-') && f.endsWith('.json'));
    const list = files.map(name => {
      const full = path.join(BACKUP_DIR, name);
      const st = fs.statSync(full);
      // Try to peek inside for entry counts (cheap because most files small)
      let counts = {};
      try {
        const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
        const d = raw.data || raw;
        counts = {
          videos: (d.videos || []).length,
          events: (d.events || []).length,
          modelPool: (d.modelPool || []).length,
          teamIssues: (d.teamIssues || []).length,
          clinicEvents: (d.clinicEvents || []).length,
        };
      } catch (_) {}
      return { name, size: st.size, mtime: st.mtime.toISOString(), counts };
    });
    // Sort newest first
    list.sort((a, b) => b.mtime.localeCompare(a.mtime));
    res.json({ ok: true, backups: list });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Restore from a backup file. Body: { name: 'plan-XXX.json' }
// IMPORTANT: also backs up current plan.json before restoring (safety net)
app.post('/api/restore', requireAuth, (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string' || name.includes('/') || name.includes('..')) {
    return res.status(400).json({ ok: false, error: 'invalid backup name' });
  }
  // Allow plan-*.json or any .json file in data dir (for emergency recovery from corrupt files)
  let src;
  if (name.startsWith('backups/')) {
    src = path.join(BACKUP_DIR, name.slice('backups/'.length));
  } else if (name.endsWith('.json')) {
    // Could be in BACKUP_DIR or DATA_DIR root
    const candidate1 = path.join(BACKUP_DIR, name);
    const candidate2 = path.join(DATA_DIR, name);
    src = fs.existsSync(candidate1) ? candidate1 : candidate2;
  } else {
    return res.status(400).json({ ok: false, error: 'must be .json file' });
  }
  if (!fs.existsSync(src)) return res.status(404).json({ ok: false, error: 'backup not found at ' + src });
  try {
    // Try to parse the source first to make sure it's valid
    const raw = fs.readFileSync(src, 'utf8');
    const parsed = JSON.parse(raw);
    // Save current state as a pre-restore safety backup
    if (fs.existsSync(DATA_FILE)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, `pre-restore-${stamp}.json`));
    }
    // Copy backup to current
    fs.copyFileSync(src, DATA_FILE);
    res.json({ ok: true, restored: name, updated_at: parsed.updated_at || Date.now() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// List entire data directory (debug)
app.get('/api/debug-ls', requireAuth, (req, res) => {
  try {
    const items = [];
    function walk(dir, prefix='') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          items.push({ path: prefix + e.name + '/', type: 'dir' });
          walk(full, prefix + e.name + '/');
        } else {
          const st = fs.statSync(full);
          items.push({ path: prefix + e.name, size: st.size, mtime: st.mtime.toISOString() });
        }
      }
    }
    walk(DATA_DIR);
    res.json({ ok: true, dataDir: DATA_DIR, items });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Read any file under DATA_DIR by path (debug, for recovery)
app.get('/api/debug-read', requireAuth, (req, res) => {
  const rel = req.query.path;
  if (!rel || typeof rel !== 'string' || rel.includes('..')) return res.status(400).json({ ok: false, error: 'invalid path' });
  const full = path.join(DATA_DIR, rel);
  if (!full.startsWith(DATA_DIR)) return res.status(400).json({ ok: false, error: 'path escape' });
  if (!fs.existsSync(full)) return res.status(404).json({ ok: false, error: 'not found' });
  try {
    const raw = fs.readFileSync(full, 'utf8');
    // Try parse
    let parsed = null, parseError = null;
    try { parsed = JSON.parse(raw); } catch (e) { parseError = e.message; }
    res.json({
      ok: true,
      size: raw.length,
      parseError,
      summary: parsed ? {
        hasData: !!parsed.data,
        updated_at: parsed.updated_at,
        videos: (parsed.data?.videos || parsed.videos || []).length,
        modelPool: (parsed.data?.modelPool || parsed.modelPool || []).length,
        teamIssues: (parsed.data?.teamIssues || parsed.teamIssues || []).length,
        clinicEvents: (parsed.data?.clinicEvents || parsed.clinicEvents || []).length,
        events: (parsed.data?.events || parsed.events || []).length,
      } : null,
      // First 500 chars for inspection (in case of corruption)
      head: raw.slice(0, 500),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Redirect / to /login.html if not authed
app.get('/', (req, res, next) => {
  if (!verifyToken(req.cookies?.zr_session)) {
    return res.redirect('/login.html');
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`zr-shooting-plan listening on :${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
