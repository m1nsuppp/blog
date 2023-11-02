import { PostList } from '@/components/post/post-list';
import { cn } from '@/lib/cn';
import { getPosts } from '@/lib/post';

const PostsPage = async () => {
  const posts = await getPosts();

  return (
    <main className={cn('max-w-4xl mx-auto p-2 mt-8 pb-4')}>
      <PostList posts={posts} />
    </main>
  );
};

export default PostsPage;
