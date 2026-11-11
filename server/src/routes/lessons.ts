import { Router } from 'express';
import type { Question } from '../../../shared/types';
import { ai } from '../ai';
import { db } from '../db';
import { userId } from './auth';

export const lessons = Router();

const loadLesson = (id: number) => {
  const lesson = db.prepare('SELECT id, user_id AS userId, topic FROM lessons WHERE id = ?').get(id) as any;
  if (!lesson) return null;
  const steps = db.prepare('SELECT id, text, topic, options, correct, answer FROM lesson_steps WHERE lesson_id = ?').all(id) as any[];
  lesson.questions = steps.map((s) => ({ ...s, options: s.options ? JSON.parse(s.options) : undefined })) as Question[];
  return lesson;
};

// 5.1.4 Jautājumu ģenerēšana: { topic, uploadIds? } -> Lesson
lessons.post('/', async (req, res) => {
  const uid = userId(req);
  const { topic = '', uploadIds = [] } = req.body ?? {};
  const material = (uploadIds as number[])
    .map((id) => (db.prepare('SELECT text FROM uploads WHERE id = ? AND user_id = ?').get(id, uid) as any)?.text ?? '')
    .join('\n\n');
  if (!topic && !material) return res.status(400).json({ error: 'Norādi tēmu vai augšupielādē materiālu' });

  try {
    const questions = await ai.generateQuestions(topic, material || undefined);
    const lessonId = Number(db.prepare('INSERT INTO lessons (user_id, topic) VALUES (?, ?)').run(uid, topic || 'Materiāls').lastInsertRowid);
    const insert = db.prepare('INSERT INTO lesson_steps (lesson_id, text, topic, options, correct) VALUES (?, ?, ?, ?, ?)');
    for (const q of questions) insert.run(lessonId, q.text, q.topic, q.options ? JSON.stringify(q.options) : null, q.correct);
    res.status(201).json(loadLesson(lessonId));
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});

// 5.1.5 Pārbaudījuma atvēršana (bez pareizajām atbildēm)
lessons.get('/:id', (req, res) => {
  const lesson = loadLesson(Number(req.params.id));
  if (!lesson) return res.status(404).json({ error: 'Nav atrasts' });
  lesson.questions = lesson.questions.map(({ correct, ...q }: Question) => q);
  res.json(lesson);
});

// 5.1.5 / 5.1.6 Atbilžu iesniegšana un pārbaude: { answers: { [questionId]: string } } -> Result
lessons.post('/:id/submit', async (req, res) => {
  const lesson = loadLesson(Number(req.params.id));
  if (!lesson) return res.status(404).json({ error: 'Nav atrasts' });
  const answers = req.body?.answers ?? {};
  let correct = 0;
  const weak = new Set<string>();
  for (const q of lesson.questions as Question[]) {
    q.answer = answers[q.id] ?? '';
    db.prepare('UPDATE lesson_steps SET answer = ? WHERE id = ?').run(q.answer!, q.id);
    if (await ai.checkAnswer(q)) correct++;
    else weak.add(q.topic);
  }
  const result = { lessonId: lesson.id, correct, total: lesson.questions.length, weakTopics: [...weak] };
  db.prepare('INSERT OR REPLACE INTO lesson_feedback (lesson_id, correct, total, weak_topics) VALUES (?, ?, ?, ?)')
    .run(lesson.id, correct, result.total, JSON.stringify(result.weakTopics));
  res.json(result);
});

// Rezultātu vēsture / mācību progress
lessons.get('/', (req, res) => {
  const rows = db
    .prepare(`SELECT f.lesson_id AS lessonId, f.correct, f.total, f.weak_topics AS weakTopics
              FROM lessons l JOIN lesson_feedback f ON f.lesson_id = l.id WHERE l.user_id = ? ORDER BY l.id`)
    .all(userId(req)) as any[];
  res.json(rows.map((r) => ({ ...r, weakTopics: JSON.parse(r.weakTopics) })));
});
