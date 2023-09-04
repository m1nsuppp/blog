import { Post } from '@/.contentlayer/generated';
import Link from 'next/link';

const PostCard = (post: Post) => {
  return (
    <Link
      href={post.url}
      className="hover:bg-zinc-800 group p-4 rounded"
    >
      <h3 className="text-2xl tracking-tight group-hover:text-red-400 mb-3">{post.title}</h3>
      <p>{post.description}</p>
    </Link>
  );
};

export default PostCard;
