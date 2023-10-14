'use client';

import { Post } from '@/.contentlayer/generated';
import { cn } from '@/lib/cn';
import { useMDXComponent } from 'next-contentlayer/hooks';

const PostArticle = (post: Post) => {
  const MDXComponent = useMDXComponent(post.body.code);

  const { title } = post;

  return (
    <article className="max-w-2xl mx-auto py-12 px-4 prose dark:prose-invert">
      <h1
        className={cn(
          'max-w-4xl font-bold md:font-black',
          'text-3xl pr-6 md:pr-24 mb-4 mx-auto',
          'text-white hover:text-red-400 tracking-tight',
        )}
      >
        {title}
      </h1>
      <MDXComponent
        components={{
          code: (code) => <code className="text-red-400">{code.children}</code>,
          strong: (strong) => <strong className="text-zinc-300">{strong.children}</strong>,
          a: (a) => (
            <a
              className="text-blue-400 underline"
              href={a.href}
            >
              {a.children}
            </a>
          ),
        }}
      />
    </article>
  );
};

export default PostArticle;
