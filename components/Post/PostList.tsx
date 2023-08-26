import PostItem from './PostItem';

export type Post = {
  title: string;
  description: string;
};

const postList: Post[] = [
  {
    title: 'Post 1',
    description: 'Description 1',
  },
  {
    title: 'Post 2',
    description: 'Description 2',
  },
  {
    title: 'Post 3',
    description: 'Description 3',
  },
  {
    title: 'Post 4',
    description: 'Description 4',
  },
  {
    title: 'Post 5',
    description: 'Description 5',
  },
  {
    title: 'Post 6',
    description: 'Description 6',
  },
  {
    title: 'Post 7',
    description: 'Description 7',
  },
  {
    title: 'Post 8',
    description: 'Description 8',
  },
  {
    title: 'Post 9',
    description: 'Description 9',
  },
  {
    title: 'Post 10',
    description: 'Description 10',
  },
];

const PostList = () => {
  return (
    <section className="flex flex-col gap-y-3">
      {postList.map((post) => (
        <PostItem
          key={post.title}
          {...post}
        />
      ))}
    </section>
  );
};

export default PostList;
