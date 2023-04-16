'use client';

import { Post } from '@/.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';

type PostProps = {
  post: Post;
};

const PostArticle: React.FC<PostProps> = ({ post }) => {
  const MDXComponent = useMDXComponent(post.body.code);
  const { title } = post;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 prose lg:prose-xl">
      <h1 className="font-bold md:font-black sm:text-6xl text-3xl pr-6 md:pr-24 mb-4 hover:text-gray-600 tracking-tight max-w-4xl mx-auto">
        {title}
      </h1>
      <MDXComponent />
    </article>
  );
};

export default PostArticle;
