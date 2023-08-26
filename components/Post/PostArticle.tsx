'use client';

import { Post } from '@/.contentlayer/generated';
import { cn } from '@/lib/cn';
import { useMDXComponent } from 'next-contentlayer/hooks';

const PostArticle = (post: Post) => {
  const MDXComponent = useMDXComponent(post.body.code);
  const { title } = post;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 prose lg:prose-xl">
      <h1
        className={cn(
          'max-w-4xl font-bold md:font-black sm:text-6xl',
          'text-3xl pr-6 md:pr-24 mb-4 mx-auto',
          'text-white hover:text-red-400 tracking-tight',
        )}
      >
        {title}
      </h1>
      <MDXComponent
        components={{
          h2: (h2) => <h2 className="text-white">{h2.children}</h2>,
          p: (p) => <p className="text-white">{p.children}</p>,
          code: (code) => <code className="text-blue-500">{code.children}</code>,
          strong: (strong) => <strong className="text-red-400">{strong.children}</strong>,
        }}
      />
    </article>
  );
};

export default PostArticle;
