import Link from 'next/link';
import { Post } from './PostList';

type PostItemProps = Post;

const PostItem = (props: PostItemProps) => {
  return (
    <Link
      href={`/posts/${props.title}`}
      className="hover:bg-zinc-800 group p-4 rounded"
    >
      <h3 className="text-2xl tracking-tight group-hover:text-red-400 mb-3">{props.title}</h3>
      <p>{props.description}</p>
    </Link>
  );
};

export default PostItem;
