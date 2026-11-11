import { Link } from 'react-router-dom';
import type { Result } from '../../../shared/types';

// TODO: ielādēt no GET /api/lessons (vēsture) un pēdējā pārbaudījuma rezultātu
const result: Result = { lessonId: 1, correct: 7, total: 10, weakTopics: ['Normalizācija', 'Ārējās atslēgas'] };
const history = [40, 55, 50, 70, 80];

/** 5. ekrāns — Rezultāti, vājās tēmas, mācību progress. */
export function Results() {
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
