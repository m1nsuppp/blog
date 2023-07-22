import { NextPage } from 'next';
import { getPostList } from '@/lib/post';
import PostArticleList from '@/components/post/ArticleList';

const PostsPage: NextPage = () => {
  const postList = getPostList();

  return (
    <main className="max-w-4xl w-full mx-auto p-2">
      <PostArticleList postList={postList} />
    </main>
  );
};

export default PostsPage;
