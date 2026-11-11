import { useEffect, useState } from 'react';
import type { User } from '../../../shared/types';
import { api } from '../api';

/** 7./8. ekrāns — Lietotāju pārvaldība. */
export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState<'add' | 'password' | 'delete' | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  useEffect(() => {
    api<User[]>('GET', '/admin/users').then(setUsers).catch((e) => setError(e.message));
  }, []);

  function close() {
     setDialog(null);
     setSelected(null);
     setUsername('');
     setEmail('');
     setPassword('');
     setRole('student');
  }
  
  function run(method: string, path: string, body?: unknown) {
    setError('');
    api(method, path, body)
      .then(() => {
        close();
        api<User[]>('GET', '/admin/users').then(setUsers).catch((e) => setError(e.message));
      })
      .catch((e) => setError(e.message));
  }


  return (
    <div className="card">
      <h3>Lietotāji</h3>
      <div className="row">
        <input placeholder="Meklēt" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setDialog('add')}>+ Pievienot lietotāju</button>
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
                <button onClick={() => { setSelected(u); setDialog('password'); }}>Mainīt paroli</button>
                <button onClick={() => { setSelected(u); setDialog('delete'); }}>Izslēgt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        {dialog && (
        <div className="card">
          {dialog === 'add' && (
            <>
              <h3>Pievienot lietotāju</h3>
              <input placeholder="Lietotājvārds" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input placeholder="E-pasts" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input placeholder="Parole" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Lietotājs</option>
                <option value="admin">Administrators</option>
              </select>
              <div className="row">
                <button onClick={() => run('POST', '/admin/users', { username, email, password, role })}>Pievienot</button>
                <button onClick={close}>Atcelt</button>
              </div>
            </>
          )}

          {dialog === 'password' && selected && (
            <>
              <h3>Mainīt paroli — {selected.username}</h3>
              <input placeholder="Jaunā parole" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="row">
                <button onClick={() => run('PUT', `/admin/users/${selected.id}/password`, { password })}>Saglabāt</button>
                <button onClick={close}>Atcelt</button>
              </div>
            </>
          )}

          {dialog === 'delete' && selected && (
            <>
              <h3>Izslēgt lietotāju</h3>
              <p>Vai apstiprināt lietotāja {selected.username} izslēgšanu?</p>
              <div className="row">
                <button onClick={() => run('DELETE', `/admin/users/${selected.id}`)}>Izslēgt</button>
                <button onClick={close}>Atcelt</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
