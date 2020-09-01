import Layout from "../components/PublicLayout/publicLayout";
import PostsContainer from "../components/Posts/postsContainer";
import fetch from "isomorphic-unfetch";

const Index = ({ initialData }) => {
  return (
    <Layout>
      <PostsContainer category="" initialData={initialData} />
    </Layout>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1`
  );
  const initialData = await res.json();

  return {
    revalidate: 10,
    props: {
      initialData: initialData,
    },
  };
}

export default Index;
