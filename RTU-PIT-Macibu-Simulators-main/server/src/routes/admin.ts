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
admin.put('/settings', (req, res) => {
  // TODO: saglabāt Settings (piem. tabulā settings ar vienu JSON rindu)
  res.status(501).json({ error: 'TODO: iestatījumi' });
});
