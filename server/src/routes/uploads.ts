import { Router } from 'express';
import multer from 'multer';
import { db } from '../db';
import { userId } from './auth';

export const uploads = Router();

const MAX_FILE_MB = 15;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_MB * 1024 * 1024 } });

// Augšupielādēto materiālu saraksts
uploads.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT id, file_name AS fileName, size_bytes AS sizeBytes FROM uploads WHERE user_id = ?')
    .all(userId(req));
  res.json(rows);
});

// 5.1.3 Mācību materiāla augšupielāde
// TODO: pārbaudīt nedēļas limitu; ņemt maks. izmēru no iestatījumiem
uploads.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const error = err.code === 'LIMIT_FILE_SIZE' ? `Fails nedrīkst būt lielāks par ${MAX_FILE_MB} MB` : err.message;
      return res.status(400).json({ error });
    }
    if (err) return next(err);

    const id = userId(req);
    if (!Number.isInteger(id) || id <= 0) return res.status(401).json({ error: 'Nav norādīts lietotājs' });

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Nav izvēlēts fails' });
    // Pagaidām atbalstām tikai TXT failus
    if (!file.originalname.toLowerCase().endsWith('.txt')) {
      return res.status(400).json({ error: 'Pagaidām atļauti tikai TXT faili' });
    }

    const text = file.buffer.toString('utf8').trim();
    if (!text) return res.status(400).json({ error: 'Fails ir tukšs' });

    const result = db
      .prepare('INSERT INTO uploads (user_id, file_name, size_bytes, text) VALUES (?, ?, ?, ?)')
      .run(id, file.originalname, file.size, text);
    res.status(201).json({ id: Number(result.lastInsertRowid), fileName: file.originalname, sizeBytes: file.size });
  });
});

uploads.delete('/:id', (req, res) => {
  // TODO: DELETE FROM uploads WHERE id = ? AND user_id = ?
  res.status(501).json({ error: 'TODO: dzēšana' });
});
