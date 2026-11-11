import { DatabaseSync } from 'node:sqlite';

// SQLite fails blakus serverim. Izdzēs `data.db`, lai sāktu no jauna.
export const db = new DatabaseSync('data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,              -- TODO: glabāt hash
    role     TEXT NOT NULL DEFAULT 'student',
    plan     TEXT NOT NULL DEFAULT 'free',
    blocked  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    file_name  TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    text       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    topic      TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lesson_steps (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id),
    text      TEXT NOT NULL,
    topic     TEXT NOT NULL,
    options   TEXT,                      -- JSON masīvs vai NULL
    correct   TEXT NOT NULL,
    answer    TEXT
  );

  CREATE TABLE IF NOT EXISTS lesson_feedback (
    lesson_id   INTEGER PRIMARY KEY REFERENCES lessons(id),
    correct     INTEGER NOT NULL,
    total       INTEGER NOT NULL,
    weak_topics TEXT NOT NULL            -- JSON masīvs
  );

  CREATE TABLE IF NOT EXISTS payments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    amount     INTEGER NOT NULL,         -- centos
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- TODO pēc vajadzības: subjects, chats, messages (Projektējums 2.2)

  INSERT OR IGNORE INTO users (username, email, password, role, plan)
  VALUES ('admin', 'admin@example.test', 'admin123', 'admin', 'paid'),
         ('students', 'students@example.test', 'students123', 'student', 'free');
`);
