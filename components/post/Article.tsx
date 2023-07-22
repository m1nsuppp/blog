import { cn } from '@/lib/utils';
import { Post } from '@/models/post';

type PostArticleProps = {
  post: Post;
};

const PostArticle: React.FC<PostArticleProps> = ({ post }) => {
  return (
    <article
      dangerouslySetInnerHTML={{ __html: post.content }}
      className={cn(
        'prose prose-headings:text-white',
        'prose-p:text-white prose-li:text-white',
        'prose-a:text-red-400 prose-pre:bg-[#282a36] prose-code:text-blue-300'
      )}
    />
  );
};

export default PostArticle;
