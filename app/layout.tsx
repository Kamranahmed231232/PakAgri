import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3, Noto_Nastaliq_Urdu } from 'next/font/google';
import { AuthProvider } from '@/lib/supabase/auth-context';
import Navbar from '@/components/pakagri/Navbar';
import Footer from '@/components/pakagri/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PakAgri | کسان کا ڈیجیٹل ساتھی',
  description: 'Smart Crop Recommendation & Yield Predictor for Pakistani Farmers - پاکستان کی زراعت کے لیے ذہین فصل کی سفارش اور پیداوار کی پیش گوئی',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} ${notoNastaliq.variable}`}>
      <body className="font-sans bg-pakagri-cream text-pakagri-earth-dark antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
