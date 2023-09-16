import { siteConfig } from '@/config/site';
import { getPosts } from '@/lib/post';
import { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseURL = siteConfig.url;

  const posts = await getPosts();

  const homeURL: MetadataRoute.Sitemap = [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];

  const postURL: MetadataRoute.Sitemap = [
    {
      url: `${baseURL}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const postURLs: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseURL}${post.url}`,
    lastModified: post.date,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...homeURL, ...postURL, ...postURLs];
};

export default sitemap;
