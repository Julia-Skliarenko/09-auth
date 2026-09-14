import Link from 'next/link';
import { AuthNavigation } from '../AuthNavigation/AuthNavigation';
import { getMe } from '@/lib/api/serverApi';
import css from './Header.module.css';

export default async function Header() {
  let user = null;

  try {
    user = await getMe();
  } catch {
    user = null;
  }

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.headerLink}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navigationLink}>Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all" className={css.navigationLink}>Notes</Link>
          </li>
          <AuthNavigation user={user} />
        </ul>
      </nav>
    </header>
  );
}