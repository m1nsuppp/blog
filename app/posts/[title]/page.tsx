import PostArticle from '@/components/post/post-article';
import { getPostByTitle, getPosts } from '@/lib/post';
import { PostDetailPageParams } from '@/types/url-params';

export const generateStaticParams = async () => {
  const posts = await getPosts();

  return posts;
};

const PostDetailPage = async ({ params }: PostDetailPageParams) => {
  const post = await getPostByTitle(params.title);

  if (!post) {
    return <p>not found post.</p>;
  }

  return <PostArticle {...post} />;
};

export default PostDetailPage;
