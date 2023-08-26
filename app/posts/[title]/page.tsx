type PostDetailPageParams = {
  params: {
    title: string;
  };
};

const PostDetailPage = ({ params }: PostDetailPageParams) => {
  return (
    <main className="max-w-4xl mx-auto p-2">
      <article>{params.title}</article>
    </main>
  );
};

export default PostDetailPage;
