import { Post } from '@/.contentlayer/generated';
import PostCard from './PostCard1';

type PostListProps = {
  postList: Post[];
};

const PostList = ({ postList }: PostListProps) => {
  return (
    <section className="flex flex-col gap-y-3">
      {postList.map((post) => (
        <PostCard
          key={post._id}
          {...post}
        />
      ))}
    </section>
  );
};

export default PostList;
