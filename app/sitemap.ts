import { siteConfig } from '@/config/site';
import { getPostList } from '@/lib/post';
import { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseURL = siteConfig.url;

  const postList = await getPostList();

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

  const postURLList: MetadataRoute.Sitemap = postList.map((post) => ({
    url: `${baseURL}${post.url}`,
    lastModified: post.date,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...homeURL, ...postURL, ...postURLList];
};

export default sitemap;
