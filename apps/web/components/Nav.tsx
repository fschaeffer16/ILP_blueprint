'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Today' },
  { href: '/library', label: 'Content library' },
  { href: '/class', label: 'My class' },
  { href: '/assign', label: 'Assign once' },
  { href: '/adaptive', label: 'Adaptive delivery' },
  { href: '/grading', label: 'Grading review' },
  { href: '/flags', label: 'Help signals' },
  { href: '/author', label: 'Learning Objective builder' },
  { href: '/lesson', label: 'Lesson builder' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/exam', label: 'Exam analysis' },
  { href: '/baseline', label: 'Baseline' },
  { href: '/messages', label: 'Parent messages' },
  { href: '/parent', label: 'Parent app' },
  { href: '/student', label: 'Student app' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Primary">
      {LINKS.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
