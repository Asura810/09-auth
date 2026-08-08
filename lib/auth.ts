import { api } from './api/api';
import { User } from '@/types/user';
export async function register(data: { email: string; password: string }): Promise<User> {
  const res = await api.post('/auth/register', data);
  return res.data;
}
export async function login(data: { email: string; password: string }): Promise<User> {
  const res = await api.post('/auth/login', data);
  return res.data;
}
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
export async function getSession(): Promise<User | null> {
  const res = await api.get('/auth/session');
  return res.data || null;
}
