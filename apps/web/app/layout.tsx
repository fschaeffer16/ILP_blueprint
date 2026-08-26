import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '../components/Nav';
import { ThemeToggle } from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'ILP — Teacher Command Center',
  description:
    'The teacher command center for ILP, running the real @ilp/core engine on synthetic data.',
};

// Apply the saved theme before first paint so the toggle never flashes.
const NO_FLASH = `(function(){try{var t=localStorage.getItem('ilp-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              ILP <span>·</span> Teacher Command Center
            </div>
            <Nav />
            <ThemeToggle />
          </div>
        </header>
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
