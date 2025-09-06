import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vaulted Ambition',
    short_name: 'Ambition',
    description: 'Achieve your goals and unlock your ambitions.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#111827',
    orientation: 'portrait-primary',
    id: '/',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
    shortcuts: [
      {
        name: 'New Mission',
        short_name: 'New',
        url: '/?new=1',
      },
    ],
  };
}
