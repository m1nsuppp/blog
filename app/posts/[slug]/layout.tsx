import { siteConfig } from '@/lib/constants';
import { getPostBySlug } from '@/lib/post';
import type { PostDetailPageParams } from './slug.model';
import type { Metadata } from 'next';

interface PostLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: PostDetailPageParams): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post?.title || siteConfig.name,
    description: post?.description || siteConfig.description,
    authors: {
      name: siteConfig.author,
      url: post?.url || siteConfig.url,
    },
    creator: siteConfig.author,
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      title: post?.title || siteConfig.name,
      description: post?.description || siteConfig.name,
      url: `${siteConfig.url}${post?.description || siteConfig.description}`,
    },
  };
}

export default function PostRootLayout({ children }: PostLayoutProps) {
  return <main className="max-w-4xl mx-auto p-2">{children}</main>;
}
