import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { Post } from 'contentlayer/generated';
import PostCard from '@/components/PostCard';
import { NextPage } from 'next';

interface Props {
  posts: Post[];
}

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const posts = allPosts.sort((a: Post, b: Post) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
  return { props: { posts } };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <main className="max-w-2xl mx-auto p-4">
      {posts.map((post: Post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </main>
  );
};

export default Home;
