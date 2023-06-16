import type { Metadata } from 'next';
import { defaultMetadata } from '@/constants/metadata';
import { allPosts } from '@/.contentlayer/generated';
import { siteConfig } from '@/config/site';
import PostArticle from '@/components/post/post-article';
import { notFound } from 'next/navigation';

type PostPageParams = {
  params: {
    title: string;
  };
};

async function getPostByTitle({ params }: PostPageParams) {
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === params.title
  );

  return post;
}

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

export default async function PostPage({ params }: PostPageParams) {
  const post = await getPostByTitle({ params });

  if (!post) {
    notFound();
  }

  return <PostArticle post={post} />;
}
