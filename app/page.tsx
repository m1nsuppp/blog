import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import PostCard from '@/components/post-card';

async function getPosts() {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return posts;
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="w-full mx-auto">
      {posts.map((post) => (
        <PostCard key={post._id} post={{ ...post }} />
      ))}
    </main>
  );
}
