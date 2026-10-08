import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'HACKPICK 2026 | National Level Hackathon - Ideate. Build. Present.',
  description:
    'HackPick is a National Level Hackathon organized by Altruisty Innovation. Compete across 3 rounds, win ₹10,000 cash prizes, and secure internships with stipend. Registration fee ₹149/team.',
  keywords: [
    'hackpick',
    'national hackathon',
    'altruisty innovation',
    'hackathon 2026',
    'engineering students',
    'coding competition',
  ],
  authors: [{ name: 'Altruisty Innovation' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} scroll-smooth`}>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-cyan-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
