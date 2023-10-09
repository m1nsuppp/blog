import Header from '@/components/header/header';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/lib/constants';
import './globals.css';
import { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

type RootLayoutProps = {
  children: React.ReactNode;
};

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    '웹 개발',
    '타입스크립트',
    '자바스크립트',
    'Web Development',
    'TypeScript',
    'JavaScript',
  ],
  creator: 'm1nsuplee',
  authors: [
    {
      name: 'm1nsuplee',
      url: siteConfig.url,
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  robots: {
    follow: true,
    index: true,
  },
  verification: {
    google: 'NbB2lZ4_61PvGarA92ve8GkzLdoM5DRiU4288ys_GR8',
  },
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko">
      <head />
      <body
        className={cn('min-h-screen bg-black/90 text-gray-200 font-sans', notoSansKR.className)}
      >
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
