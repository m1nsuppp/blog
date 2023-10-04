import { Post } from '@/.contentlayer/generated';
import PostCard from './post-card';

type PostListProps = {
  posts: Post[];
};

const PostList = ({ posts }: PostListProps) => {
  return (
    <div
      id="post-list"
      className="flex flex-col gap-y-3"
    >
      {posts.map((post) => (
        <PostCard
          key={post._id}
          {...post}
        />
      ))}
    </div>
  );
};

export default PostList;
