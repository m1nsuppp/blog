import { Post } from '@/.contentlayer/generated';
import { PostItem } from './post-item';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-y-3">
      {posts.map((post) => (
        <PostItem
          key={post._id}
          {...post}
        />
      ))}
    </ul>
  );
}
