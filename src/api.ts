import type { Bootstrap, StoredSession } from '../shared/contracts';
import type { Progress, SessionConfig } from './types';
export async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'Cannot reach Recall. Check that the local API and database are running. Your changes were not confirmed saved.',
    );
  }
  let result: any;
  try {
    result = await response.json();
  } catch {
    throw new Error('Recall returned an invalid response. Check the local API.');
  }
  if (!response.ok) throw new Error(result.error ?? 'This change could not be saved.');
  return result as T;
}
export const api = {
  bootstrap: () => request<Bootstrap>('/bootstrap'),
  session: (id: string) => request<StoredSession>(`/sessions/${id}`),
  start: (config: SessionConfig, cardIds?: string[]) =>
    request<StoredSession>('/sessions', 'POST', { config, cardIds }),
  change: (session: StoredSession, body: Record<string, unknown>) =>
    request<StoredSession>(`/sessions/${session.id}`, 'PATCH', {
      ...body,
      version: session.version,
    }),
  read: (id: string, read: boolean) =>
    request<Progress>(`/read/${encodeURIComponent(id)}`, 'PUT', { read }),
  import: (progress: Progress, legacy = false) =>
    request<Progress>('/progress/import', 'POST', { progress, legacy }),
};
