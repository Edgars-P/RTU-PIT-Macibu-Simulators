import { Router } from 'express';
import { db } from '../db';
import { userId } from './auth';
import multer from 'multer';

export const uploads = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // Maksimums 15 MB
  },
});

// Augšupielādēto materiālu saraksts
uploads.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT id, file_name AS fileName, size_bytes AS sizeBytes FROM uploads WHERE user_id = ?')
    .all(userId(req));
  res.json(rows);
});

// 5.1.3 Mācību materiāla augšupielāde                            //pašlaik nepārbauda nedēļas limitu
uploads.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'Fails nedrīkst būt lielāks par 15 MB',
        });
      }

      return res.status(400).json({ error: err.message });}

    if (err) return next(err);

    try {
      const id = userId(req);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(401).json({ error: 'Nav norādīts lietotājs' });}

      if (!req.file) {
        return res.status(400).json({ error: 'Nav izvēlēts fails' });}

      // Pagaidām atbalstām TXT failus.
      if (!req.file.originalname.toLowerCase().endsWith('.txt')) {
        return res.status(400).json({
          error: 'Pagaidām atļauti tikai TXT faili',
        });}

      const text = req.file.buffer.toString('utf8').trim();

      if (!text) {
        return res.status(400).json({ error: 'Fails ir tukšs' });}

      const result = db.prepare(`
        INSERT INTO uploads (user_id, file_name, size_bytes, text)
        VALUES (?, ?, ?, ?)
      `).run(
        id,
        req.file.originalname,
        req.file.size,
        text);

      return res.status(201).json({
        id: Number(result.lastInsertRowid),
        fileName: req.file.originalname,
        sizeBytes: req.file.size,
      });
    } catch {
      return res.status(500).json({
        error: 'Neizdevās saglabāt failu',
      });}
  });
});

uploads.delete('/:id', (req, res) => {
  // TODO: DELETE FROM uploads WHERE id = ? AND user_id = ?
  res.status(501).json({ error: 'TODO: dzēšana' });
});
