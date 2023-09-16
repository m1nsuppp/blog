import { allPosts } from '@/.contentlayer/generated';
import { compareDesc } from 'date-fns';
import { cache } from 'react';

export const getPosts = cache(async () => {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return posts;
});

export const getPostByTitle = async (title: string) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === title);

  return post;
};
