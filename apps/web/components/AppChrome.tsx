'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from './Nav';
import { ThemeToggle } from './ThemeToggle';

// The parent and student experiences are their own products — a family or a child
// never sees the teacher console. On those routes we fold the full teacher nav away
// and show a compact app bar with a Home button back to the console, so the demo
// spends its screen on the product, not the menu.
const ROLE_APPS: Record<string, string> = {
  '/parent': 'Family app',
  '/student': 'Student app',
};

export function AppChrome() {
  const pathname = usePathname();
  const roleKey = Object.keys(ROLE_APPS).find(
    (k) => pathname === k || pathname.startsWith(k + '/'),
  );

  if (roleKey) {
    return (
      <header className="topbar roleapp">
        <div className="topbar-inner">
          <Link href="/" className="homebtn" aria-label="Back to the teacher console">
            <span aria-hidden="true">←</span> Console
          </Link>
          <div className="brand">
            ILP <span>·</span> {ROLE_APPS[roleKey]}
          </div>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          ILP <span>·</span> Teacher Command Center
        </div>
        <Nav />
        <ThemeToggle />
      </div>
    </header>
  );
}
