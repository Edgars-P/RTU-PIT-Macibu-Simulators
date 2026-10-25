import { Router } from 'express';
import { db } from '../db';
import { userId } from './auth';

export const uploads = Router();

// Augšupielādēto materiālu saraksts
uploads.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT id, file_name AS fileName, size_bytes AS sizeBytes FROM uploads WHERE user_id = ?')
    .all(userId(req));
  res.json(rows);
});

// 5.1.3 Mācību materiāla augšupielāde
uploads.post('/', (req, res) => {
  // TODO: saņemt failu (piem. ar `multer`), pārbaudīt izmēru (15 MB) un nedēļas limitu,
  //       izvilkt tekstu, INSERT INTO uploads
  res.status(501).json({ error: 'TODO: augšupielāde' });
});

uploads.delete('/:id', (req, res) => {
  // TODO: DELETE FROM uploads WHERE id = ? AND user_id = ?
  res.status(501).json({ error: 'TODO: dzēšana' });
});
