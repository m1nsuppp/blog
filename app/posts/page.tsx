import PostList from '@/components/Post1/PostList1';
import { cn } from '@/lib/cn';
import { getPostList } from '@/lib/post';

const PostsPage = async () => {
  const postList = await getPostList();

  return (
    <main className={cn('max-w-4xl mx-auto p-2 mt-8 pb-4')}>
      <PostList postList={postList} />
    </main>
  );
};

export default PostsPage;
