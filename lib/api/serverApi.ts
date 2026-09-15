import { cookies } from 'next/headers';
import axios from 'axios';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

const BACKEND_URL = process.env.BACKEND_URL || 'https://notehub-api.goit.study';


const serverAxios = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export async function fetchNotes(page = 1, perPage = 12, search = '', tag = '') {
  const authConfig = await getAuthHeaders();
  const params: Record<string, string | number> = { page, perPage };
  if (search?.trim()) params.search = search.trim();
  if (tag?.trim()) params.tag = tag.trim();

  const response = await serverAxios.get<{ notes: Note[]; totalPages: number }>('/notes', {
    ...authConfig,
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const authConfig = await getAuthHeaders();
  const response = await serverAxios.get<Note>(`/notes/${id}`, authConfig);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const authConfig = await getAuthHeaders();
  const response = await serverAxios.delete<Note>(`/notes/${id}`, authConfig);
  return response.data;
}

export async function getMe(): Promise<User> {
  const authConfig = await getAuthHeaders();
  const response = await serverAxios.get<User>('/users/me', authConfig);
  return response.data;
}

export async function checkSession() {
  try {
    const authConfig = await getAuthHeaders();
    const response = await serverAxios.get<User | null>('/auth/session', authConfig);
    return response;
  } catch {
    return null;
  }
}