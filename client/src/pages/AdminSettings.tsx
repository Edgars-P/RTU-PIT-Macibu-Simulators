import { useEffect, useState } from 'react';
import type { Settings } from '../../../shared/types';
import { api } from '../api';

/** 9. ekrāns — Sistēmas iestatījumi (reklāmas, MI, ierobežojumi). */
export function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Settings>('GET', '/admin/settings').then(setS).catch((e) => setError(e.message));
  }, []);

  if (!s) return <div className="card">{error ? <p className="error">{error}</p> : 'Iestatījumi tiek ielādēti...'}</div>;

  const num = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [key]: Number(e.target.value) });

  function save() {
    setError('');
    api('PUT', '/admin/settings', s).catch((e) => setError(e.message));
  }

  return (
    <div className="card">
      <h3>Sistēmas iestatījumi</h3>
      <label className="row"><input type="checkbox" style={{ width: 'auto' }} checked={s.adsEnabled} onChange={(e) => setS({ ...s, adsEnabled: e.target.checked })} /> Reklāmas ieslēgtas</label>
      <label>LLM modelis
        <select value={s.aiModel} onChange={(e) => setS({ ...s, aiModel: e.target.value })}>
          <option value="mock">mock</option>
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
        </select>
      </label>
      <label>Maks. faila izmērs (MB)<input type="number" value={s.maxFileMb} onChange={num('maxFileMb')} /></label>
      <label>Augšupielādes nedēļā — bezmaksas<input type="number" value={s.freeUploadsPerWeek} onChange={num('freeUploadsPerWeek')} /></label>
      <label>Augšupielādes nedēļā — maksas<input type="number" value={s.paidUploadsPerWeek} onChange={num('paidUploadsPerWeek')} /></label>
      <p className="error">{error}</p>
      <button onClick={save}>Saglabāt</button>
    </div>
  );
}
