import { Router } from 'express';
import type { Settings } from '../../../shared/types';
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
const defaultSettings: Settings = { maxFileMb: 15, freeUploadsPerWeek: 20, paidUploadsPerWeek: 60, adsEnabled: true, aiModel: 'mock' };
const aiModels = ['mock', 'openai', 'gemini'];

admin.get('/settings', (req, res) => {
  const row = db.prepare('SELECT data FROM settings WHERE id = 1').get() as { data: string } | undefined;
  res.json(row ? JSON.parse(row.data) : defaultSettings);
});

admin.put('/settings', (req, res) => {
  const { maxFileMb, freeUploadsPerWeek, paidUploadsPerWeek, adsEnabled, aiModel } = req.body ?? {};
  const valid =
    Number.isInteger(maxFileMb) && maxFileMb >= 1 &&
    Number.isInteger(freeUploadsPerWeek) && freeUploadsPerWeek >= 0 &&
    Number.isInteger(paidUploadsPerWeek) && paidUploadsPerWeek >= 0 &&
    typeof adsEnabled === 'boolean' &&
    aiModels.includes(aiModel);
  if (!valid) return res.status(400).json({ error: 'Nepiemēroti iestatījumi' });

  // Saglabā tikai zināmos laukus, nevis visu pieprasījuma ķermeni
  const settings: Settings = { maxFileMb, freeUploadsPerWeek, paidUploadsPerWeek, adsEnabled, aiModel };
  db.prepare('INSERT INTO settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data')
    .run(JSON.stringify(settings));
  res.json(settings);
});
