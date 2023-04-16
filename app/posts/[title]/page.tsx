import PostArticle from '@/components/PostArticle';
import { allPosts, Post } from '@/.contentlayer/generated';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

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
  const { title, description, url, thumbnail } = post ?? ({} as Post);

  return {
    title: siteConfig.name,
    description,
    authors: {
      name: siteConfig.author,
      url,
    },
    creator: siteConfig.author,
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      title,
      description,
      url: `${siteConfig.url}${url}`,
      images: [
        {
          url: thumbnail ?? '',
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  };
};

const PostPage = async ({ params }: PostPageParams) => {
  const post = (await getPostByTitle({ params })) ?? ({} as Post);

  return <PostArticle post={post} />;
};

export default PostPage;
