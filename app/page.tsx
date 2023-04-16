import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import PostCard from '@/components/PostCard';
import { NextPage } from 'next';

export const getPosts = async () => {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return posts;
};

/* @ts-expect-error Async Server Component */
const HomePage: NextPage = async () => {
  const posts = await getPosts();

  return (
    <>
      <main className="max-w-4xl mx-auto p-4">
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </main>
    </>
  );
};

export default HomePage;
