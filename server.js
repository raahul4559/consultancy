const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const USERS = {
  admin: 'admission@2024',
  manager: 'prime@2024'
};

const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let leads = [];
try {
  if (fs.existsSync(LEADS_FILE)) {
    leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  }
} catch (e) {
  console.error('Could not load leads.json, starting empty:', e.message);
}

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), (err) => {
      if (err) console.error('Persist failed:', err.message);
    });
  }, 200);
}

const sessions = new Map();
const SESSION_DURATION = 24 * 60 * 60 * 1000;

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function isValidSession(token) {
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expires) {
    sessions.delete(token);
    return false;
  }
  return true;
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !isValidSession(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.session = sessions.get(token);
  next();
}

app.use(express.static(path.join(__dirname, 'public')));

// /admin path serves the admin shell (matches Vercel rewrite)
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (USERS[username] && USERS[username] === password) {
    const token = generateToken();
    sessions.set(token, { username, expires: Date.now() + SESSION_DURATION });
    return res.json({ success: true, token, username });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && isValidSession(token)) {
    const session = sessions.get(token);
    return res.json({ valid: true, username: session.username });
  }
  return res.json({ valid: false });
});

// ============ LEADS ============
const VALID_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

function addActivity(lead, type, text, by) {
  if (!lead.activity) lead.activity = [];
  lead.activity.push({ type, text, by: by || 'system', at: new Date().toISOString() });
}

// Public — submit lead
app.post('/api/leads', (req, res) => {
  const lead = req.body || {};
  if (!lead.name || !lead.phone) return res.status(400).json({ error: 'Name and phone are required' });

  const newLead = {
    id: Date.now().toString() + Math.floor(Math.random() * 1000),
    ...lead,
    status: 'new',
    priority: lead.priority || 'medium',
    notes: [],
    reminders: [],
    activity: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  addActivity(newLead, 'created', `Lead captured from ${lead.source || 'website'}`);

  leads.push(newLead);
  persist();
  console.log('New lead:', newLead.name, newLead.phone, '— source:', lead.source || 'unknown');

  res.status(201).json({ success: true, id: newLead.id });
});

// Protected — list all
app.get('/api/leads', requireAuth, (req, res) => {
  const sorted = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// Protected — get one
app.get('/api/leads/:id', requireAuth, (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Protected — update (status, priority, fields)
app.patch('/api/leads/:id', requireAuth, (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const { status, priority, name, phone, email, course, college, branch, exam, city, state, category, message } = req.body || {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    if (lead.status !== status) {
      addActivity(lead, 'status', `Status changed: ${lead.status} → ${status}`, req.session.username);
      lead.status = status;
    }
  }
  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) return res.status(400).json({ error: 'Invalid priority' });
    if (lead.priority !== priority) {
      addActivity(lead, 'priority', `Priority: ${lead.priority} → ${priority}`, req.session.username);
      lead.priority = priority;
    }
  }
  ['name','phone','email','course','college','branch','exam','city','state','category','message'].forEach(k => {
    if (req.body[k] !== undefined && lead[k] !== req.body[k]) {
      lead[k] = req.body[k];
    }
  });

  lead.updatedAt = new Date().toISOString();
  persist();
  res.json(lead);
});

// Protected — delete
app.delete('/api/leads/:id', requireAuth, (req, res) => {
  const idx = leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  leads.splice(idx, 1);
  persist();
  res.json({ success: true });
});

// Protected — add note
app.post('/api/leads/:id/notes', requireAuth, (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Note text required' });

  if (!lead.notes) lead.notes = [];
  const note = { id: Date.now().toString(), text, by: req.session.username, at: new Date().toISOString() };
  lead.notes.push(note);
  addActivity(lead, 'note', `Note added: "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`, req.session.username);
  lead.updatedAt = new Date().toISOString();
  persist();
  res.status(201).json(note);
});

// Protected — add reminder
app.post('/api/leads/:id/reminders', requireAuth, (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const text = (req.body?.text || '').trim();
  const due = req.body?.due;
  if (!text || !due) return res.status(400).json({ error: 'text and due required' });

  if (!lead.reminders) lead.reminders = [];
  const reminder = { id: Date.now().toString(), text, due, done: false, by: req.session.username, at: new Date().toISOString() };
  lead.reminders.push(reminder);
  addActivity(lead, 'reminder', `Reminder set for ${new Date(due).toLocaleString()}: ${text}`, req.session.username);
  lead.updatedAt = new Date().toISOString();
  persist();
  res.status(201).json(reminder);
});

// Protected — toggle reminder done
app.patch('/api/leads/:id/reminders/:rid', requireAuth, (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const reminder = (lead.reminders || []).find(r => r.id === req.params.rid);
  if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
  if (req.body?.done !== undefined) reminder.done = !!req.body.done;
  if (req.body?.text) reminder.text = req.body.text;
  if (req.body?.due) reminder.due = req.body.due;
  lead.updatedAt = new Date().toISOString();
  persist();
  res.json(reminder);
});

// Protected — analytics
app.get('/api/analytics', requireAuth, (req, res) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const weekStart = now - 7 * day;
  const monthStart = now - 30 * day;

  const byStatus = {};
  const byPriority = {};
  const bySource = {};
  const byDay = {}; // last 30 days

  let todayCount = 0, weekCount = 0, monthCount = 0;
  let upcomingReminders = 0, overdueReminders = 0;

  leads.forEach(l => {
    const created = new Date(l.createdAt).getTime();
    if (created >= todayStart.getTime()) todayCount++;
    if (created >= weekStart) weekCount++;
    if (created >= monthStart) monthCount++;

    byStatus[l.status || 'new'] = (byStatus[l.status || 'new'] || 0) + 1;
    byPriority[l.priority || 'medium'] = (byPriority[l.priority || 'medium'] || 0) + 1;
    const src = l.source || 'unknown';
    bySource[src] = (bySource[src] || 0) + 1;

    if (created >= monthStart) {
      const dayKey = new Date(created).toISOString().slice(0, 10);
      byDay[dayKey] = (byDay[dayKey] || 0) + 1;
    }

    (l.reminders || []).forEach(r => {
      if (r.done) return;
      const dueT = new Date(r.due).getTime();
      if (dueT < now) overdueReminders++;
      else if (dueT < now + 7 * day) upcomingReminders++;
    });
  });

  const wonCount = byStatus.won || 0;
  const totalClosed = (byStatus.won || 0) + (byStatus.lost || 0);
  const conversionRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  res.json({
    total: leads.length,
    today: todayCount,
    week: weekCount,
    month: monthCount,
    byStatus,
    byPriority,
    bySource,
    byDay,
    conversionRate,
    upcomingReminders,
    overdueReminders
  });
});

// Protected — all open reminders across leads
app.get('/api/reminders', requireAuth, (req, res) => {
  const all = [];
  leads.forEach(l => {
    (l.reminders || []).forEach(r => {
      all.push({ ...r, leadId: l.id, leadName: l.name, leadPhone: l.phone });
    });
  });
  all.sort((a, b) => new Date(a.due) - new Date(b.due));
  res.json(all);
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   EduVista Admin Server Running           ║
  ╠═══════════════════════════════════════════╣
  ║   Dashboard: http://localhost:${PORT}/admin   ║
  ║   API:       http://localhost:${PORT}/api     ║
  ║   Leads:     ${String(leads.length).padEnd(4)} loaded from data/leads.json    ║
  ╚═══════════════════════════════════════════╝
  `);
});
