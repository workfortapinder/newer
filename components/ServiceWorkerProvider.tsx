"use client";

import { useEffect } from 'react';

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          // Optional: you can listen for updatefound and show a toast
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('SW registration failed', err);
        }
      };
      register();
    }
  }, []);

  return null;
}
