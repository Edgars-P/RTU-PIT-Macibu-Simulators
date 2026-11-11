import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { getUser, setUser } from './api';
import { AdminSettings } from './pages/AdminSettings';
import { AdminUsers } from './pages/AdminUsers';
import { Login } from './pages/Login';
import { NewTest } from './pages/NewTest';
import { Register } from './pages/Register';
import { Results } from './pages/Results';
import { Subscription } from './pages/Subscription';
import { Test } from './pages/Test';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<NewTest />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/** Galvene ar navigāciju (wireframe 3. un 7. ekrāns). */
function Layout() {
  const user = getUser();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <header className="topbar">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin/users">Lietotāji</Link>
            <Link to="/admin/settings">Sistēmas iestatījumi</Link>
          </>
        ) : (
          <>
            <Link to="/">Jauns tests</Link>
            <Link to="/results">Rezultāti</Link>
            <Link to="/subscription">Abonements</Link>
          </>
        )}
        <span className="spacer">{user.username}</span>
        <button onClick={() => { setUser(null); navigate('/login'); }}>Iziet</button>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
