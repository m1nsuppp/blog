import { Post, allPosts } from '@/.contentlayer/generated';
import PostArticle from '@/components/Post/PostArticle';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next/types';

type PostDetailPageParams = {
  params: {
    title: string;
  };
};

const getPostByTitle = async ({ params }: PostDetailPageParams) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.title);

  return post;
};

export const generateMetadata = async ({ params }: PostDetailPageParams): Promise<Metadata> => {
  const post = await getPostByTitle({ params });
  const { title, description, url } = post ?? ({} as Post);

  return {
    title: title,
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
          url: '',
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  };
};

const PostDetailPage = async ({ params }: PostDetailPageParams) => {
  const post = await getPostByTitle({ params });

  if (!post) {
    return <p>not found post.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-2">
      <PostArticle {...post} />
    </main>
  );
};

export default PostDetailPage;
