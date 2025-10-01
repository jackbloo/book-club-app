/// <reference types="vite/client" />

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, body: err };
  }
  if(res.status === 204) return true;
  return res.json();
}
