import { Post, allPosts } from '@/.contentlayer/generated';
import { compareDesc } from 'date-fns';
import { cache } from 'react';

export const getPosts = cache(async function (): Promise<Post[]> {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return posts;
});

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  return post;
}
