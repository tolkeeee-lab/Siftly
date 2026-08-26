import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AICopilotDrawer } from '../src/components/copilot/AICopilotDrawer';

export const metadata: Metadata = {
  title: 'Siftly — Recherche produit EAA',
  description:
    'Siftly est une plateforme conçue pour aider les e-commerçants à passer au tamis les tendances du marché et à isoler les produits à fort potentiel.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Siftly',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon-192.jpg',
    apple: '/icon-192.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#141B32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <AICopilotDrawer />
      </body>
    </html>
  );
}
