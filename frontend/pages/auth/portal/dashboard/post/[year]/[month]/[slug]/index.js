import { useRouter } from "next/router";
import Layout from "../../../../../../../../components/DashboardLayout/dashboardLayout";
import EditorWrapper from "../../../../../../../../components/Editor/EditorWrapper";

const Index = ({ query }) => {
  const router = useRouter();
  console.log(router.query);
  return (
    <Layout selectedCategory={"None"}>
      <EditorWrapper query={query} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}

export default Index;
