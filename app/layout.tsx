import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#07070a' },
  ],
};

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
    <html lang="ar" dir="rtl" className={`light ${cairo.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('mafia_theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
