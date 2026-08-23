import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'السويداء برس',
  description: 'منصة إخبارية سورية مستقلة',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}