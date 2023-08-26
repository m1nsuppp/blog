import PostList from '@/components/Post/PostList';
import { cn } from '@/lib/cn';

const PostsPage = () => {
  return (
    <main className={cn('max-w-4xl mx-auto p-2 mt-8 pb-4')}>
      <PostList />
    </main>
  );
};

export default PostsPage;
