import OpengraphImage from 'components/opengraph-image';
import { PostDetailPageParams } from './slug.model';
import { getPostBySlug } from '@/lib/post';

export const runtime = 'edge';

export default async function Image({ params }: PostDetailPageParams) {
  const post = await getPostBySlug(params.slug);

  const title = post?.title || params.slug;

  return await OpengraphImage({ title });
}
