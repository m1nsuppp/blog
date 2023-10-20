import OpengraphImage from 'components/opengraph-image';
import { PostDetailPageParams } from './slug.type';

export const runtime = 'edge';

export default async function Image({ params }: PostDetailPageParams) {
  return await OpengraphImage({ title: params.slug });
}
