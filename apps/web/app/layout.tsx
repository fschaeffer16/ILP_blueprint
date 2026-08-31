import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppChrome } from '../components/AppChrome';

export const metadata: Metadata = {
  title: 'ILP — Teacher Command Center',
  description:
    'The teacher command center for ILP, running the real @ilp/core engine on synthetic data.',
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'ILP', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0E8F9E' },
    { media: '(prefers-color-scheme: dark)', color: '#10151B' },
  ],
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
        <AppChrome />
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
