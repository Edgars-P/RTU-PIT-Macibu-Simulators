// Kopīgie tipi klientam un serverim. Atbilst datubāzes tabulām (Projektējums 2.2).
// Importēt tikai ar `import type`.

export type Role = 'student' | 'admin';
export type Plan = 'free' | 'paid';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  plan: Plan;
  blocked: boolean;
}

/** Augšupielādēts mācību materiāls (Uploads). */
export interface Upload {
  id: number;
  userId: number;
  fileName: string;
  sizeBytes: number;
  text: string;
}

/** Pārbaudījums (Lessons). */
export interface Lesson {
  id: number;
  userId: number;
  topic: string;
  questions: Question[];
}

/** Viens jautājums (Lesson_Steps). Bez `options` — brīvā teksta jautājums. */
export interface Question {
  id: number;
  text: string;
  topic: string;
  options?: string[];
  correct: string;
  answer?: string;
}

/** Pārbaudījuma rezultāts (Lesson_Feedback). */
export interface Result {
  lessonId: number;
  correct: number;
  total: number;
  weakTopics: string[];
}

/** Sistēmas iestatījumi (Prasības 3.6–3.10). */
export interface Settings {
  maxFileMb: number;
  freeUploadsPerWeek: number;
  paidUploadsPerWeek: number;
  adsEnabled: boolean;
  aiModel: string;
}
