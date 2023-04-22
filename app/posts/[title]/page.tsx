import type { Metadata } from 'next';
import { defaultMetadata } from '@/constants/metadata';
import { allPosts } from '@/.contentlayer/generated';
import { siteConfig } from '@/config/site';
import PostArticle from '@/components/PostArticle';
import Loading from '@/components/ui/Loading';

type PostPageParams = {
  params: {
    title: string;
  };
};

const getPostByTitle = async ({ params }: PostPageParams) => {
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === params.title
  );

  return post;
};

export const generateMetadata = async ({
  params,
}: PostPageParams): Promise<Metadata> => {
  const post = await getPostByTitle({ params });

  return post === undefined
    ? defaultMetadata
    : {
        title: siteConfig.name,
        description: post.description,
        authors: {
          name: siteConfig.author,
          url: post.url,
        },
        creator: siteConfig.author,
        openGraph: {
          type: 'article',
          locale: 'ko_KR',
          title: post.title,
          description: post.description,
          url: `${siteConfig.url}${post.url}`,
          images: [
            {
              url: post.thumbnail,
              width: 300,
              height: 300,
              alt: post.title,
            },
          ],
        },
      };
};

const PostPage = async ({ params }: PostPageParams) => {
  const post = await getPostByTitle({ params });

  if (post === undefined) {
    return <Loading />;
  }

  return <PostArticle post={post} />;
};

export default PostPage;
