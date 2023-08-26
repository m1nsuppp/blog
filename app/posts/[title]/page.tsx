type Params = {
  params: {
    title: string;
  };
};

const PostDetailPage = (params: Params) => {
  return <main className="max-w-4xl mx-auto p-2">{params.params.title}</main>;
};

export default PostDetailPage;
