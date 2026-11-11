import { useState } from 'react';
import type { Settings } from '../../../shared/types';
import { api } from '../api';

// TODO: ielādēt no servera
const defaults: Settings = { maxFileMb: 15, freeUploadsPerWeek: 20, paidUploadsPerWeek: 60, adsEnabled: true, aiModel: 'mock' };

/** 9. ekrāns — Sistēmas iestatījumi (reklāmas, MI, ierobežojumi). */
export function AdminSettings() {
  const [s, setS] = useState(defaults);
  const [error, setError] = useState('');
  const num = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [key]: Number(e.target.value) });

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
      <button onClick={() => api('PUT', '/admin/settings', s).catch((e) => setError(e.message))}>Saglabāt</button>
    </div>
  );
}
