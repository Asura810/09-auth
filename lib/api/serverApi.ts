import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { cookies } from 'next/headers';
export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}
export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>('/users/me', {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}
export async function checkSession() {
  const cookieStore = await cookies();
  return api.get('auth/session', { headers: { Cookie: cookieStore.toString() } });
}
