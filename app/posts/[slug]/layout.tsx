import { siteConfig } from '@/lib/constants';
import { getPostByTitle } from '@/lib/post';
import { PostDetailPageParams } from '@/types/url-params';

type PostLayoutProps = {
  children: React.ReactNode;
};

export const generateMetadata = async ({ params }: PostDetailPageParams) => {
  const post = await getPostByTitle(params.slug);

  return {
    title: post?.title,
    description: post?.description,
    authors: {
      name: siteConfig.author,
      url: post?.url,
    },
    creator: siteConfig.author,
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      title: post?.title,
      description: post?.description,
      url: `${siteConfig.url}${post?.description}`,
      images: [
        {
          url: post?.thumbnail || 'opengraph-image.png',
          width: 300,
          height: 300,
          alt: post?.title,
        },
      ],
    },
  };
};

const PostRootLayout = ({ children }: PostLayoutProps) => {
  return <main className="max-w-4xl mx-auto p-2">{children}</main>;
};

export default PostRootLayout;
