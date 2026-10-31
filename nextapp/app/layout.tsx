import type { Metadata } from 'next';
import { Quicksand, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppShell } from './components/layout/AppShell';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KosanKu - Kelola Kos Jadi Menyenangkan 🐱🏡',
  description:
    'Aplikasi manajemen kos-kosan dengan desain pastel imut, modern, dan ramah pengguna untuk pengelolaan kamar, penghuni, tagihan, dan keuangan kos.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: 'any' },
      { url: '/icon.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/app-logo.png?v=3', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-icon.png?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${quicksand.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=3" />
      </head>
      <body className="font-body bg-cream-50 text-darkcocoa min-h-screen flex flex-col antialiased selection:bg-peach-100 selection:text-peach-500">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
