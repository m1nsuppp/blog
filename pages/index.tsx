import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { Post } from 'contentlayer/generated';
import PostCard from '@/components/PostCard';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Head from 'next/head';

interface Props {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: GetStaticPropsContext) => {
  const posts = allPosts.sort((a: Post, b: Post) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });

  return {
    props: { posts },
  };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <meta property="og:url" content="https://www.m1nsuppp.site/" />
      </Head>
      <main className="max-w-4xl mx-auto p-4">
        {posts.map((post: Post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </main>
    </>
  );
};

export default Home;
