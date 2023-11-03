import { siteConfig } from '@/lib/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL = siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
