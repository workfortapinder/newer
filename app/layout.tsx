import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Vaulted Ambition',
  description: 'Achieve your goals and unlock your ambitions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="theme-color" content="#111827" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className={cn('font-body antialiased')}>
        {children}
        <Toaster />
  <ServiceWorkerProvider />
      </body>
    </html>
  );
}
