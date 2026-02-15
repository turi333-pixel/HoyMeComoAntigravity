'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header({ locale }) {
    const pathname = usePathname();

    const getPathForLocale = (newLocale) => {
        if (!pathname) return `/${newLocale}`;
        const segments = pathname.split('/');
        // segments = ["", "en", "recipe", "1"]
        if (segments.length > 1) {
            segments[1] = newLocale;
            return segments.join('/');
        }
        return `/${newLocale}`;
    };

    return (
        <header className={styles.header}>
            <Link href={`/${locale}`} className={styles.logo}>
                HoyMeComo
            </Link>

            <nav className={styles.nav}>
                {['en', 'es', 'de'].map((l) => (
                    <Link
                        key={l}
                        href={getPathForLocale(l)}
                        className={`${styles.langLink} ${locale === l ? styles.active : ''}`}
                    >
                        {l.toUpperCase()}
                    </Link>
                ))}
            </nav>
        </header>
    );
}
