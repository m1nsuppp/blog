import { allPosts } from '@/.contentlayer/generated';
import PostList from '@/components/Post/PostList';
import { cn } from '@/lib/cn';
import { compareDesc } from 'date-fns';

const getPostList = async () => {
  const postList = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return postList;
};

const PostsPage = async () => {
  const postList = await getPostList();

  return (
    <main className={cn('max-w-4xl mx-auto p-2 mt-8 pb-4')}>
      <PostList postList={postList} />
    </main>
  );
};

export default PostsPage;
