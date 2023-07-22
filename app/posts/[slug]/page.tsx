import { NextPage } from 'next';
import { getPostBySlug } from '@/lib/post';
import PostArticle from '@/components/post/Article';

type PostPageParams = {
  params: {
    slug: string;
  };
};

const PostPage: NextPage<PostPageParams> = ({ params: { slug } }) => {
  const post = getPostBySlug(slug);

  return (
    <main className="max-w-4xl w-full mx-auto p-2 mt-6">
      <PostArticle post={post} />
    </main>
  );
};

export default PostPage;
