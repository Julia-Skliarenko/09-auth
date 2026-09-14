'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export function AuthNavigation() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
      router.refresh();
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        {user?.email && (
          <li className={css.navigationItem}>
            <span className={css.userEmail}>{user.email}</span>
          </li>
        )}
        <li className={css.navigationItem}>
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
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Register
        </Link>
      </li>
    </>
  );
}