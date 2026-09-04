import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

export const metadata: Metadata = {
  title: 'Creator Hub',
  description: 'All-in-one influencer dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Loaded as a normal stylesheet the browser fetches at runtime, not via
          next/font/google — that fetches fonts.gstatic.com at `next build` time,
          which hangs when a Docker build sandbox can't reach that host.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans text-black">
        <Providers>
          <div className="flex min-h-screen bg-canvas">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
              <TopBar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
