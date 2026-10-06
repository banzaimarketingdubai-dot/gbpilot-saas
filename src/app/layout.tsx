import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'GBPilot - Proactive AI Google Maps Growth Copilot',
  description: 'Autonomous 24/7 Google Business Profile Growth Engine delivering daily 5 Next Best Actions with 1-Click execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-google-bg text-google-text-primary min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
