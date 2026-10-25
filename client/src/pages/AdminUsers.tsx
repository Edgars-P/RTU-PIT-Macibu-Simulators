import { useEffect, useState } from 'react';
import type { User } from '../../../shared/types';
import { api } from '../api';

/** 7./8. ekrāns — Lietotāju pārvaldība. TODO: dialogi pievienošanai, paroles maiņai, izslēgšanai. */
export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api<User[]>('GET', '/admin/users').then(setUsers).catch((e) => setError(e.message));
  }, []);

  const run = (method: string, path: string) => api(method, path).catch((e) => setError(e.message));

  return (
    <div className="card">
      <h3>Lietotāji</h3>
      <div className="row">
        <input placeholder="Meklēt" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => run('POST', '/admin/users')}>+ Pievienot lietotāju</button>
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
                <button onClick={() => run('PUT', `/admin/users/${u.id}/password`)}>Mainīt paroli</button>
                <button onClick={() => run('DELETE', `/admin/users/${u.id}`)}>Izslēgt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
