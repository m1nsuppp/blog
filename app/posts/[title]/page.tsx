import PostArticle from '@/components/post/post-article';
import { getPostByTitle, getPosts } from '@/lib/post';
import { PostDetailPageParams } from '@/types/url-params';
import { notFound } from 'next/navigation';

export const generateStaticParams = async () => {
  const posts = await getPosts();

  return posts;
};

const PostDetailPage = async ({ params }: PostDetailPageParams) => {
  const post = await getPostByTitle(params.title);

  if (!post) {
    notFound();
  }

  return <PostArticle {...post} />;
};

export default PostDetailPage;
