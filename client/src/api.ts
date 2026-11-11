import type { User } from '../../shared/types';

/** Ielogotais lietotājs (glabājas localStorage). */
export function getUser(): User | null {
  return JSON.parse(localStorage.getItem('user') ?? 'null');
}

export function setUser(user: User | null) {
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * fetch apvalks: JSON iekšā/ārā, kļūdas ziņa no servera `{ error }`.
 * `FormData` ķermenis tiek sūtīts kā multipart (Content-Type uzliek pārlūks).
 */
export async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      'x-user-id': String(getUser()?.id ?? ''),
    },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? res.statusText);
  return data;
}
