import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../../shared/types';
import { api, setUser } from '../api';

/** 1. ekrāns — Autorizācija. Testa konti: students / students123, admin / admin123 */
export function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const user = await api<User>('POST', '/auth/login', { login, password });
      setUser(user);
      navigate(user.role === 'admin' ? '/admin/users' : '/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Mācību simulators</h2>
      <label>Lietotājvārds / e-pasts<input value={login} onChange={(e) => setLogin(e.target.value)} /></label>
      <label>Parole<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <p className="error">{error}</p>
      <button>Ielogoties</button> <Link to="/register">Nav konta? Reģistrēties</Link>
    </form>
  );
}
