import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Mlinzi v3.0 — The Quantum Guardian',
  description: 'Post-quantum, tamper-proof child safety system. Kenya DPA 2019 compliant. Hub31 iSense.',
  keywords: ['child safety', 'Kenya', 'GPS tracking', 'SOS', 'NFC', 'post-quantum cryptography', 'DPA 2019'],
  authors: [{ name: 'Hub31 iSense', url: 'https://hub31.xyz' }],
  creator: 'Hub31 iSense',
  publisher: 'Hub31 iSense',
  metadataBase: new URL('https://mlinzi.app'),
  openGraph: {
    title: 'Mlinzi — The Quantum Guardian',
    description: 'Protecting Kenya's children with quantum-resistant security',
    url: 'https://mlinzi.app',
    siteName: 'Mlinzi',
    locale: 'sw_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mlinzi — The Quantum Guardian',
    description: 'Post-quantum child safety for Kenya',
    creator: '@hub31isense',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00A86B',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className={inter.variable}>
      <body className="bg-mlinzi-dark text-white min-h-screen antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid #00A86B',
            },
            success: {
              iconTheme: { primary: '#00A86B', secondary: '#1a1a2e' },
            },
            error: {
              iconTheme: { primary: '#FF4444', secondary: '#1a1a2e' },
            },
          }}
        />
      </body>
    </html>
  );
}
