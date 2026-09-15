import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface UpdateUserPayload {
  username?: string;
  avatar?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export interface AuthPayload {
  email: string;
  password?: string;
  name?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function fetchNotes(
  page: number = 1,
  perPage: number = 12,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search?.trim()) params.search = search.trim();
  if (tag?.trim()) params.tag = tag.trim();

  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(newNote: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>('/notes', newNote);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(data: RegisterPayload): Promise<User> {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: AuthPayload): Promise<User> {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User | null>('/auth/session');
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}

export async function updateMe(data: UpdateUserPayload): Promise<User> {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
}

export { api };
export { api as clientApi };