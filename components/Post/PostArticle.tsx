'use client';

import { Post } from '@/.contentlayer/generated';
import { cn } from '@/lib/cn';
import { useMDXComponent } from 'next-contentlayer/hooks';

const PostArticle = (post: Post) => {
  const MDXComponent = useMDXComponent(post.body.code);
  const { title } = post;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 prose">
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
          h1: (h1) => <h1 className="text-white">{h1.children}</h1>,
          h2: (h2) => <h2 className="text-white">{h2.children}</h2>,
          h3: (h3) => <h3 className="text-white">{h3.children}</h3>,
          p: (p) => <p className="text-white">{p.children}</p>,
          code: (code) => <code className="text-red-400">{code.children}</code>,
          strong: (strong) => <strong className="text-zinc-200">{strong.children}</strong>,
          a: (a) => (
            <a
              className="text-blue-400"
              href={a.href}
            >
              {a.children}
            </a>
          ),
          li: (li) => <li className="text-gray-300">{li.children}</li>,
        }}
      />
    </article>
  );
};

export default PostArticle;
