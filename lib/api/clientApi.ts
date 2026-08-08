import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

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

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}
export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
  });

  return response.data;
};

export const getNotes = (
  params: FetchNotesParams = {
    page: 1,
    perPage: 9,
    search: '',
  }
) => {
  return fetchNotes({
    page: params.page,
    perPage: params.perPage ?? 9,
    search: params.search ?? '',
    tag: params.tag,
  });
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

interface RegisterRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);

  return response.data;
};

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);

  return response.data;
};

export const checkSession = async () => {
  const response = await api.get('/auth/session', {
    withCredentials: true,
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};
export const logout = async () => {
  await api.post('/auth/logout');
};

interface UpdateUserRequest {
  username: string;
}

export const updateMe = async (data: UpdateUserRequest): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);

  return response.data;
};
