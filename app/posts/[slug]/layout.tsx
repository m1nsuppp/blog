import { siteConfig } from '@/lib/constants';
import { getPostByTitle } from '@/lib/post';
import type { PostDetailPageParams } from '@/types/url-params';

type PostLayoutProps = {
  children: React.ReactNode;
};

export const generateMetadata = async ({ params }: PostDetailPageParams) => {
  const post = await getPostByTitle(params.slug);

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
      images: [
        {
          url: post?.thumbnail || 'opengraph-image.png',
          width: 1200,
          height: 630,
          alt: post?.title || siteConfig.name,
        },
      ],
    },
  };
};

const PostRootLayout = ({ children }: PostLayoutProps) => {
  return <main className="max-w-4xl mx-auto p-2">{children}</main>;
};

export default PostRootLayout;
