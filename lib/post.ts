import path, { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import markdownToHtml from './markdown';
import { Post } from '@/models/post';

const postsDirectory = join(process.cwd(), '_posts');

export const getPostSlugList = () => {
  return fs
    .readdirSync(postsDirectory)
    .map((postMarkdownFile) => postMarkdownFile.replace(/\.md$/, ''));
};

export const getPostBySlug = (slug: string): Post => {
  const postDirectory = path.join(postsDirectory, `${slug}.md`);
  const postContents = fs.readFileSync(postDirectory, 'utf8');
  const { data, content } = matter(postContents);

  return {
    slug,
    title: data.title,
    content: markdownToHtml(content),
    description: data.description,
    date: data.date,
  };
};

export const getPostList = () => {
  const postSlugList = getPostSlugList();

  const postList = postSlugList
    .map((slug) => {
      return {
        ...getPostBySlug(slug),
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return postList;
};
