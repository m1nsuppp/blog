import Header from '@/components/header/header';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';
import '@/styles/globals.css';
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
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['웹 개발', '프론트엔드', '타입스크립트', 'frontend', 'typescript', 'web development'],
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
    images: [siteConfig.ogImage],
    siteName: siteConfig.name,
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
