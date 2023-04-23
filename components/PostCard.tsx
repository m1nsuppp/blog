import { Post } from '@/.contentlayer/generated';
import Link from 'next/link';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="mt-12 text-white">
      <Link href={post.url}>
        <h2 className="font-bold text-3xl mb-4 hover:text-red-400">
          {post.title}
        </h2>
        <p className="text-base tracking-tight">
          {post.description}
          <span className="font-bold block underline whitespace-nowrap mt-2">
            더 읽기
          </span>
        </p>
      </Link>
    </article>
  );
}
