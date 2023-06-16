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
    <article className="w-full mx-auto px-2 py-12 prose">
      <h1 className="font-bold text-white tracking-tight w-full mx-auto">
        {title}
      </h1>
      <MDXComponent
        components={{
          h2: (h2) => <h2 className="text-white">{h2.children}</h2>,
          h3: (h3) => <h3 className="text-white">{h3.children}</h3>,
          p: (p) => (
            <p className="text-gray-300 text-sm tracking-tight">{p.children}</p>
          ),
          li: (li) => (
            <li className="text-gray-400 text-sm tracking-tight">
              {li.children}
            </li>
          ),
          code: (code) => (
            <code className="text-blue-500">{code.children}</code>
          ),
          strong: (strong) => (
            <strong className="text-red-400 text-sm tracking-tight">
              {strong.children}
            </strong>
          ),
          a: (a) => (
            <a className="text-blue-300" href={a.href}>
              {a.children}
            </a>
          ),
        }}
      />
    </article>
  );
}
