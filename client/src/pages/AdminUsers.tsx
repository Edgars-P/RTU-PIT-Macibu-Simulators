import { useEffect, useState } from 'react';
import type { Role, User } from '../../../shared/types';
import { api } from '../api';

type Dialog = 'add' | 'password' | 'delete';

/** 7./8. ekrāns — Lietotāju pārvaldība. */
export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');

  const load = () => api<User[]>('GET', '/admin/users').then(setUsers).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  /** Atver dialogu ar tukšiem laukiem (arī pārslēdzoties no cita dialoga). */
  function open(next: Dialog | null, user: User | null = null) {
    setDialog(next);
    setSelected(user);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('student');
  }
  const close = () => open(null);

  function run(method: string, path: string, body?: unknown) {
    setError('');
    api(method, path, body)
      .then(() => { close(); load(); })
      .catch((e) => setError(e.message));
  }

  return (
    <div className="card">
      <h3>Lietotāji</h3>
      <div className="row">
        <input placeholder="Meklēt" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => open('add')}>+ Pievienot lietotāju</button>
      </div>
      <p className="error">{error}</p>
      <table>
        <thead><tr><th>Lietotājvārds</th><th>E-pasts</th><th>Loma</th><th>Darbības</th></tr></thead>
        <tbody>
          {users.filter((u) => u.username.includes(search)).map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="row">
                <button onClick={() => open('password', u)}>Mainīt paroli</button>
                <button onClick={() => open('delete', u)}>Izslēgt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dialog === 'add' && (
        <div className="card">
          <h3>Pievienot lietotāju</h3>
          <input placeholder="Lietotājvārds" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="E-pasts" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Parole" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="student">Lietotājs</option>
            <option value="admin">Administrators</option>
          </select>
          <div className="row">
            <button onClick={() => run('POST', '/admin/users', { username, email, password, role })}>Pievienot</button>
            <button onClick={close}>Atcelt</button>
          </div>
        </div>
      )}

      {dialog === 'password' && selected && (
        <div className="card">
          <h3>Mainīt paroli — {selected.username}</h3>
          <input placeholder="Jaunā parole" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="row">
            <button onClick={() => run('PUT', `/admin/users/${selected.id}/password`, { password })}>Saglabāt</button>
            <button onClick={close}>Atcelt</button>
          </div>
        </div>
      )}

      {dialog === 'delete' && selected && (
        <div className="card">
          <h3>Izslēgt lietotāju</h3>
          <p>Vai apstiprināt lietotāja {selected.username} izslēgšanu?</p>
          <div className="row">
            <button onClick={() => run('DELETE', `/admin/users/${selected.id}`)}>Izslēgt</button>
            <button onClick={close}>Atcelt</button>
          </div>
        </div>
      )}
    </div>
  );
}
