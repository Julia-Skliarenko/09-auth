import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = '',
  tag = ''
): Promise<FetchNotesResponse> {
  const authConfig = await getAuthHeaders();
  const params: Record<string, string | number> = { page, perPage };
  if (search?.trim()) params.search = search.trim();
  if (tag?.trim()) params.tag = tag.trim();

  const response = await api.get<FetchNotesResponse>('/notes', {
    ...authConfig,
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const authConfig = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, authConfig);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const authConfig = await getAuthHeaders();
  const response = await api.delete<Note>(`/notes/${id}`, authConfig);
  return response.data;
}

export async function getMe(): Promise<User> {
  const authConfig = await getAuthHeaders();
  const response = await api.get<User>('/users/me', authConfig);
  return response.data;
}

export async function checkSession() {
  const authConfig = await getAuthHeaders();
  const response = await api.get<User | null>('/auth/session', authConfig);
  return response;
}