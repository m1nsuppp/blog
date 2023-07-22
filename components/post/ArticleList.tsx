import { Post } from '@/models/post';
import Link from 'next/link';
import { PATH_NAME } from '@/lib/constants';

type PostArticleListProps = {
  postList: Post[];
};

const PostArticleList: React.FC<PostArticleListProps> = ({ postList }) => {
  return (
    <section className="mt-12 w-full flex flex-col gap-y-3">
      {postList.map((post) => (
        <article
          key={post.slug}
          className="mb-4"
        >
          <Link href={`${PATH_NAME.posts}/${post.slug}`}>
            <h3 className="text-3xl tracking-tighter hover:text-red-400">
              {post.title}
            </h3>
            <p className="mt-4 text-base -tracking-widest text-gray-200">
              {post.description}
            </p>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default PostArticleList;
