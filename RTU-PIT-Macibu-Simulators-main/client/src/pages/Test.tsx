import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../../../shared/types';

// TODO: ielādēt no GET /api/lessons/:id
const questions: Question[] = [
  { id: 1, text: 'Kura SQL komanda atgriež datus no tabulas?', topic: 'SQL', options: ['INSERT', 'SELECT', 'UPDATE', 'DROP'], correct: 'SELECT' },
  { id: 2, text: 'Paskaidrojiet, kāpēc datubāzes normalizē.', topic: 'Normalizācija', correct: '' },
];

/** 4. ekrāns — Tests: jautājumi un atbilžu lauki. */
export function Test() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const q = questions[i];
  const setAnswer = (value: string) => setAnswers({ ...answers, [q.id]: value });

  function submit() {
    // TODO: POST /api/lessons/:id/submit { answers }, tad navigate uz rezultātiem
    navigate('/results');
  }

  return (
    <div className="card">
      <p><b>Jautājums {i + 1} / {questions.length}</b></p>
      <p>{q.text}</p>
      {q.options ? (
        q.options.map((o) => (
          <label key={o} className="row">
            <input type="radio" style={{ width: 'auto' }} checked={answers[q.id] === o} onChange={() => setAnswer(o)} /> {o}
          </label>
        ))
      ) : (
        <label>Atbilde<textarea rows={4} value={answers[q.id] ?? ''} onChange={(e) => setAnswer(e.target.value)} /></label>
      )}
      <div className="row">
        <button disabled={i === 0} onClick={() => setI(i - 1)}>Iepriekšējais</button>
        <button disabled={i === questions.length - 1} onClick={() => setI(i + 1)}>Nākamais</button>
        <button className="spacer" onClick={submit}>Iesniegt atbildes</button>
      </div>
    </div>
  );
}
