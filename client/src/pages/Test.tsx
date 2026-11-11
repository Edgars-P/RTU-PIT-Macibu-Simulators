import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, Question, Result } from '../../../shared/types';
import { api } from '../api';

/** 4. ekrāns — Tests: jautājumi un atbilžu lauki. */
export function Test() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    api<Lesson>('GET', `/lessons/${id}`).then((l) => setQuestions(l.questions)).catch((e) => setError(e.message));
  }, [id]);
  const q = questions[i];
  const setAnswer = (value: string) => setAnswers({ ...answers, [q.id]: value });

  async function submit() {
    try {
      const result = await api<Result>('POST', `/lessons/${id}/submit`, { answers });
      navigate('/results', { state: result });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!q) return <div className="card"><p className="error">{error}</p>{!error && 'Ielādē...'}</div>;

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
      <p className="error">{error}</p>
      <div className="row">
        <button disabled={i === 0} onClick={() => setI(i - 1)}>Iepriekšējais</button>
        <button disabled={i === questions.length - 1} onClick={() => setI(i + 1)}>Nākamais</button>
        <button className="spacer" onClick={submit}>Iesniegt atbildes</button>
      </div>
    </div>
  );
}
