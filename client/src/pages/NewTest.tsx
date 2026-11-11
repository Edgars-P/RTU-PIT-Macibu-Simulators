import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, Upload } from '../../../shared/types';
import { api, getUser, uploadFile } from '../api';

/** 3. ekrāns — Jauns tests: materiāla augšupielāde vai tēmas ievade. */
export function NewTest() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    api<Upload[]>('GET', '/uploads').then(setUploads).catch((e) => setError(e.message));
  }, []);

  async function generate() {
    try {
       setError('');

      // If a file was selected, upload it first
      if (file) {
        await uploadFile(file);

        // Refresh the uploaded files list
        const updatedUploads = await api<Upload[]>('GET', '/uploads');
        setUploads(updatedUploads);
      }

      const lesson = await api<Lesson>('POST', '/lessons', { topic });
      navigate(`/test/${lesson.id}`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="cols">
      <div className="card">
        <h3>Jauns tests</h3>

        <label>
          Augšupielādēt mācību materiālus (maks. 15 MB)
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <p className="muted">vai</p>
        <label>Apgūstamā tēma<input value={topic} onChange={(e) => setTopic(e.target.value)} /></label>
        <p className="error">{error}</p>
        <button onClick={generate}>Ģenerēt jautājumus</button>
      </div>
      <div className="card">
        <h3>Augšupielādētie materiāli</h3>
        {uploads.length === 0 && <p className="muted">Nav materiālu</p>}
        <ul>{uploads.map((u) => <li key={u.id}>{u.fileName}</li>)}</ul>
        <p className="muted">Augšupielādes šonedēļ: {uploads.length} / 20</p>
        {getUser()?.plan === 'free' && <div className="ad">Reklāma (bezmaksas lietotājiem)</div>}
      </div>
    </div>
  );
}
