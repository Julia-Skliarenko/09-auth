import Link from 'next/link';
import { AuthNavigation } from '../AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default async function Header() {
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
          {/* Добавляем навигацию авторизации сюда */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}