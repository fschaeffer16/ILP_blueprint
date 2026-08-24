import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '../components/Nav';

export const metadata: Metadata = {
  title: 'ILP — Teacher Command Center',
  description:
    'The teacher command center for ILP, running the real @ilp/core engine on synthetic data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              ILP <span>·</span> Teacher Command Center
            </div>
            <Nav />
          </div>
        </header>
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
