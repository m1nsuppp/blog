import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMdxImages from 'remark-mdx-images';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import { Heading } from './components/toc/toc.model';

const LowestHeadingLevel = 3;

export const Post = defineDocumentType(() => ({
  name: 'Post',
  contentType: 'mdx',
  filePathPattern: `**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'string', required: true },
    description: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    headings: {
      type: 'json',
      resolve: async (doc): Promise<Heading[]> => {
        const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;

        const slugger = new GithubSlugger();

        const headings = Array.from(doc.body.raw.matchAll(regXHeader)).map(
          ({ groups }) => {
            const level = groups?.flag.length || LowestHeadingLevel;

            const content = groups?.content || '';

            const id = content ? slugger.slug(content) : '';

            return {
              level,
              content,
              id,
            };
          },
        );

        return headings;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkMdxImages, remarkGfm],
    rehypePlugins: [rehypePrettyCode, rehypeSlug],
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.png': 'dataurl',
        '.gif': 'dataurl',
      };

      return options;
    },
  },
});
