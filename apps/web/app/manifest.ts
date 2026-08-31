import type { MetadataRoute } from 'next';

// Makes ILP installable as a home-screen app on a phone (district-issued or
// otherwise): Add to Home Screen -> full-screen app, no browser chrome, no
// app store required. See docs/ese-device-strategy.md for the phone-first plan.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ILP — Individualized Lesson Planning',
    short_name: 'ILP',
    description:
      'Every student met where they are — assignments, study guides, and messages, individualized by the ILP engine.',
    start_url: '/student',
    display: 'standalone',
    background_color: '#F7F4EE',
    theme_color: '#0E8F9E',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
