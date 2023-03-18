import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { allPosts } from '@/.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Head from 'next/head';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allPosts.map((p) => ({ params: { title: p._raw.flattenedPath } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const post = allPosts.find((p) => p._raw.flattenedPath === params?.title);
  return {
    props: {
      post,
    },
  };
};

const PostPage: NextPage = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const MDXComponent = useMDXComponent(post.body.code);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article className="max-w-2xl mx-auto py-12 px-4 prose lg:prose-xl">
        <h1 className="font-bold md:font-black text-6xl md:text-7xl pr-6 md:pr-24 mb-4 hover:text-gray-600 tracking-tight max-w-2xl mx-auto">
          {post.title}
        </h1>
        <MDXComponent />
      </article>
    </>
  );
};

export default PostPage;
