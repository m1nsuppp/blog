import Header from '@/components/Header';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';
import type { Metadata } from 'next';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  authors: {
    name: siteConfig.author,
    url: siteConfig.url,
  },
  creator: siteConfig.author,
  keywords: [
    'front-end',
    '프론트엔드',
    'web',
    '웹 개발',
    'react',
    '리액트',
    'typescript',
    '타입스크립트',
  ],
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    description: siteConfig.description,
  },
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ko">
      <body className="max-w-4xl mx-auto p-4">
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
