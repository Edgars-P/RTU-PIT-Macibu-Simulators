import { Router } from 'express';
import { db } from '../db';

export const admin = Router();

// TODO: pārbaudīt, ka pieprasītājs ir administrators

// 3.5 Lietotāju pārvalde
admin.get('/users', (req, res) => {
  res.json(db.prepare('SELECT id, username, email, role, plan, blocked FROM users').all());
});

admin.post('/users', (req, res) => {
  // TODO: INSERT INTO users (var būt arī role = 'admin')
  res.status(501).json({ error: 'TODO: pievienot lietotāju' });
});

admin.delete('/users/:id', (req, res) => {
  // TODO: DELETE FROM users WHERE id = ?
  res.status(501).json({ error: 'TODO: izslēgt lietotāju' });
});

admin.put('/users/:id/password', (req, res) => {
  // TODO: UPDATE users SET password = ? WHERE id = ?
  res.status(501).json({ error: 'TODO: paroles maiņa' });
});

// 3.6 / 3.7 Sistēmas un MI iestatījumi
const defaults = { maxFileMb: 15, freeUploadsPerWeek: 20, paidUploadsPerWeek: 60, adsEnabled: true, aiModel: 'mock' };

db.exec('CREATE TABLE IF NOT EXISTS settings ( id INTEGER PRIMARY KEY, data TEXT NOT NULL)');

admin.get('/settings', (req, res) => {
  try {
    const row = db.prepare('SELECT data FROM settings WHERE id = 1').get() as { data: string } | undefined;
    res.json(row ? JSON.parse(row.data) : defaults);
  } catch (e) {
    res.status(500).json({ error: 'Neizdevās ielādēt iestatījumus' });
  }
});

admin.put('/settings', (req, res) => {
  const s = req.body;

  if (!s ||
      !Number.isInteger(s.maxFileMb) || s.maxFileMb < 1 ||
      !Number.isInteger(s.freeUploadsPerWeek) || s.freeUploadsPerWeek < 0 ||
      !Number.isInteger(s.paidUploadsPerWeek) || s.paidUploadsPerWeek < 0 ||
      typeof s.adsEnabled !== 'boolean' ||
      !['mock', 'openai', 'gemini'].includes(s.aiModel)) {
    res.status(400).json({ error: 'Nepiemēroti iestatījumi' });
    return;
  }

  try {
    db.prepare('INSERT INTO settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data')
      .run(JSON.stringify(s));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Neizdevās saglabāt iestatījumus' });
  }
});
