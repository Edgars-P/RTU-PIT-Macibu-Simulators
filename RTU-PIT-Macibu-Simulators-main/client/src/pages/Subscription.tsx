import { useState } from 'react';
import { api } from '../api';

/** 6. ekrāns — Abonements un maksājums. Maksājums ir simulēts; kartes dati netiek sūtīti. */
export function Subscription() {
  const [error, setError] = useState('');

  async function pay() {
    try {
      await api('POST', '/auth/subscribe');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="cols">
      <div className="card"><h3>Bezmaksas</h3><p>20 augšupielādes nedēļā</p><p>Ar reklāmām</p></div>
      <div className="card"><h3>Maksas</h3><p>60 augšupielādes nedēļā</p><p>Bez reklāmām</p></div>
      <div className="card">
        <h3>Maksājums</h3>
        <label>Kartes numurs<input autoComplete="off" /></label>
        <label>Kartes īpašnieks<input /></label>
        <p className="error">{error}</p>
        <button onClick={pay}>Maksāt</button>
      </div>
    </div>
  );
}
