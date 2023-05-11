'use client';

import { Post } from '@/.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';

type PostProps = {
  post: Post;
};

export default function PostArticle({ post }: PostProps) {
  const MDXComponent = useMDXComponent(post.body.code);
  const { title } = post;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 prose lg:prose-xl">
      <h1 className="font-bold md:font-black sm:text-6xl text-3xl pr-6 md:pr-24 mb-4 text-white tracking-tight max-w-4xl mx-auto">
        {title}
      </h1>
      <MDXComponent
        components={{
          h2: (h2) => <h2 className="text-white">{h2.children}</h2>,
          p: (p) => <p className="text-white">{p.children}</p>,
          code: (code) => (
            <code className="text-blue-500">{code.children}</code>
          ),
          strong: (strong) => (
            <strong className="text-red-400">{strong.children}</strong>
          ),
        }}
      />
    </article>
  );
}
