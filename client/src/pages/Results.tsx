import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Result } from '../../../shared/types';
import { api } from '../api';

/** 5. ekrāns — Rezultāti, vājās tēmas, mācību progress. */
export function Results() {
  const [results, setResults] = useState<Result[]>([]);
  useEffect(() => { api<Result[]>('GET', '/lessons').then(setResults).catch(() => {}); }, []);
  const result: Result = useLocation().state ?? results[results.length - 1] ?? { lessonId: 0, correct: 0, total: 0, weakTopics: [] };
  const history = results.map((r) => Math.round((r.correct / (r.total || 1)) * 100));

  return (
    <div className="cols">
      <div className="card">
        <h3>Vērtējums</h3>
        <p className="score">{result.correct} / {result.total}</p>
        <Link to="/"><button>Jauns tests</button></Link>
      </div>
      <div className="card">
        <h3>Vājās / apgūstamās tēmas</h3>
        {result.weakTopics.map((t) => (
          <p key={t} className="row">{t} <button className="spacer">Atkārtot</button></p>
        ))}
        <h3>Mācību progress</h3>
        <div className="row" style={{ alignItems: 'flex-end', height: 100 }}>
          {history.map((h, i) => <div key={i} style={{ width: 24, height: `${h}%`, background: '#6a8caf' }} title={`${h}%`} />)}
        </div>
      </div>
    </div>
  );
}
