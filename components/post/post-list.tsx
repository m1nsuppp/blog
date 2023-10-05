import { Post } from '@/.contentlayer/generated';
import PostCard from './post-card';

type PostListProps = {
  posts: Post[];
};

const PostList = ({ posts }: PostListProps) => {
  return (
    <ul className="flex flex-col gap-y-3">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          {...post}
        />
      ))}
    </ul>
  );
};

export default PostList;
