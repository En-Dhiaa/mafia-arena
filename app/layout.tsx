import type { Metadata } from 'next';
import { Cairo, Cinzel } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Mafia Arena — مافيا أرينا | لعبة المافيا الجماعية عبر الإنترنت',
  description:
    'لعبة الاستنتاج الاجتماعي والخدائع الليلية الأقوى عبر الإنترنت. العب مع أصدقائك مباشرة من المتصفح على الهاتف والحاسوب بمزامنة فورية.',
  keywords: ['mafia game', 'لعبة المافيا', 'werewolf online', 'social deduction', 'مافيا أرينا'],
  authors: [{ name: 'En-Dhiaa' }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Mafia Arena — مافيا أرينا',
    description: 'لعبة المافيا الاجتماعية الجماعية بمزامنة حية وبطاقات أصلية فاخرة.',
    url: 'https://mafia-arena.vercel.app',
    siteName: 'Mafia Arena',
    images: [
      {
        url: '/images/backgrounds/night-bg.png',
        width: 1200,
        height: 630,
        alt: 'Mafia Arena Cinematic Noir',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cinzel.variable}`}>
      <body className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 antialiased selection:bg-gold-500 selection:text-obsidian-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
