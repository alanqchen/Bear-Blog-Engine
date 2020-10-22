import { useRouter } from "next/router";
import Layout from "../../../../../../../../components/DashboardLayout/dashboardLayout";
import EditorWrapper from "../../../../../../../../components/Editor/EditorWrapper";

const Index = () => {
  const router = useRouter();
  return (
    <Layout selectedCategory={"None"}>
      <EditorWrapper query={router.query} />
    </Layout>
  );
};

export default Index;
