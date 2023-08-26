import Link from 'next/link';
import { Post } from './PostList';

type PostItemProps = Post;

const PostItem = (props: PostItemProps) => {
  return (
    <article>
      <Link href={`/posts/${props.title}`}>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </Link>
    </article>
  );
};

export default PostItem;
