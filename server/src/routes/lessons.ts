import { Router } from 'express';
import { ai } from '../ai';

export const lessons = Router();

// 5.1.4 Jautājumu ģenerēšana: { topic, uploadIds? } -> Lesson
lessons.post('/', async (req, res) => {
  // TODO: nolasīt materiālus no uploads, izsaukt ai.generateQuestions,
  //       INSERT INTO lessons + lesson_steps, atgriezt Lesson
  const questions = await ai.generateQuestions(req.body.topic);
  res.status(501).json({ error: 'TODO: saglabāt pārbaudījumu', preview: questions });
});

// 5.1.5 Pārbaudījuma atvēršana
lessons.get('/:id', (req, res) => {
  // TODO: SELECT lesson + lesson_steps
  res.status(501).json({ error: 'TODO: pārbaudījuma ielāde' });
});

// 5.1.5 / 5.1.6 Atbilžu iesniegšana un pārbaude: { answers: { [questionId]: string } } -> Result
lessons.post('/:id/submit', (req, res) => {
  // TODO: saglabāt atbildes, ai.checkAnswer katram, aprēķināt vājās tēmas,
  //       INSERT INTO lesson_feedback, atgriezt Result
  res.status(501).json({ error: 'TODO: atbilžu pārbaude' });
});

// Rezultātu vēsture / mācību progress
lessons.get('/', (req, res) => {
  // TODO: SELECT lessons JOIN lesson_feedback WHERE user_id = ?
  res.status(501).json({ error: 'TODO: rezultāti' });
});
