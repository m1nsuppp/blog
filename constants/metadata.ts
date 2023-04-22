import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  authors: {
    name: siteConfig.author,
    url: siteConfig.url,
  },
  creator: siteConfig.author,
  openGraph: {
    type: 'article',
    locale: 'ko_KR',
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 300,
        height: 300,
        alt: siteConfig.name,
      },
    ],
  },
};
