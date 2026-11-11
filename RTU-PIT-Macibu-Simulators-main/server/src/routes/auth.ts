import { Router, type Request } from 'express';
import { db } from '../db';

export const auth = Router();

/** TODO: īstas sesijas/JWT. Pagaidām klients sūta `x-user-id` galveni. */
export const userId = (req: Request) => Number(req.header('x-user-id'));

// 5.1.1 Autorizācija
auth.post('/login', (req, res) => {
  const { login, password } = req.body;
  const user = db
    .prepare('SELECT id, username, email, role, plan, blocked FROM users WHERE (username = ? OR email = ?) AND password = ?')
    .get(login, login, password);
  if (!user) return res.status(401).json({ error: 'E-pasts vai parole nav pareiza' });
  if (user.blocked) return res.status(403).json({ error: 'Lietotāja konts ir bloķēts' });
  res.json(user);
});

// 5.1.2 Reģistrācija
auth.post('/register', (req, res) => {
  // TODO: validēt laukus, pārbaudīt vai e-pasts brīvs, INSERT INTO users
  res.status(501).json({ error: 'TODO: reģistrācija' });
});

// 5.1.7 Abonementa iegāde
auth.post('/subscribe', (req, res) => {
  // TODO: INSERT INTO payments, UPDATE users SET plan = 'paid'
  res.status(501).json({ error: 'TODO: abonements' });
});
