import type { Metadata } from 'next';
import { Inter, Roboto_Slab, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], variable: '--font-heading' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Remate Discos',
  description: 'Vinyl record marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoSlab.variable} ${jetbrainsMono.variable} bg-background text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}