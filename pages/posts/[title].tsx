import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { allPosts, Post } from '@/.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Head from 'next/head';

interface Props {
  post: Post;
}

const AUTHOR = 'm1nsuppp';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allPosts.map((post) => ({
      params: { title: post._raw.flattenedPath },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: GetStaticPropsContext) => {
  const post = allPosts.find((p) => p._raw.flattenedPath === params?.title)!;
  return {
    props: {
      post,
    },
  };
};

const PostPage: NextPage<Props> = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const MDXComponent = useMDXComponent(post.body.code);
  const { title, description, url, thumbnail } = post;

  return (
    <>
      <Head>
        <title>{`${title} | m1nsuppp's blog`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={title} />
        <meta property="og:url" content={`https://www.m1nsuppp.site${url}`} />
        <meta property="og:site_name" content={AUTHOR} />
        <meta property="og:title" content={`${title} | m1nsuppp's blog`} />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:description" content={description} />
      </Head>
      <article className="max-w-4xl mx-auto py-12 px-4 prose lg:prose-xl">
        <h1 className="font-bold md:font-black sm:text-6xl text-3xl pr-6 md:pr-24 mb-4 hover:text-gray-600 tracking-tight max-w-4xl mx-auto">
          {title}
        </h1>
        <MDXComponent />
      </article>
    </>
  );
};

export default PostPage;
