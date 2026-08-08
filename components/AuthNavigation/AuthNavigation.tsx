'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const user = useAuthStore(state => state.user);

  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  async function handleLogout() {
    await logout();

    clearIsAuthenticated();

    router.push('/sign-in');
  }

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>

          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
