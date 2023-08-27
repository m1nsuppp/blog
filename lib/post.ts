import { allPosts } from '@/.contentlayer/generated';
import { compareDesc } from 'date-fns';
import { cache } from 'react';

export const getPostList = cache(async () => {
  const postList = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return postList;
});

export const getPostByTitle = async (title: string) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === title);

  return post;
};
