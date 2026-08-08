'use client';

import { useEffect } from 'react';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  useEffect(() => {
    async function loadUser() {
      try {
        await checkSession();

        const user = await getMe();

        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    }

    loadUser();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
