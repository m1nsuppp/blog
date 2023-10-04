import { Post } from '@/.contentlayer/generated';
import Link from 'next/link';

const PostCard = (post: Post) => {
  return (
    <li className="hover:bg-zinc-800 group p-4 rounded">
      <p className="flex flex-col gap-y-4">
        <Link
          href={post.url}
          className="w-fit text-2xl tracking-tight group-hover:text-red-400"
        >
          {post.title}
        </Link>
        <span>{post.description}</span>
      </p>
    </li>
  );
};

export default PostCard;
