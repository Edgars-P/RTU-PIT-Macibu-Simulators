import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

/** 2. ekrāns — Reģistrācija. */
export function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await api('POST', '/auth/register', form);
      // TODO: ielogot un novirzīt uz "/"
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Reģistrācija</h2>
      <label>Lietotājvārds<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
      <label>E-pasts<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Parole<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <p className="error">{error}</p>
      <button>Reģistrēties</button> <Link to="/login">Jau ir konts? Ielogoties</Link>
    </form>
  );
}
