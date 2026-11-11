import express from 'express';
import { admin } from './routes/admin';
import { auth } from './routes/auth';
import { lessons } from './routes/lessons';
import { uploads } from './routes/uploads';

const app = express();
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/uploads', uploads);
app.use('/api/lessons', lessons);
app.use('/api/admin', admin);

app.listen(3001, () => console.log('Serveris: http://localhost:3001'));
