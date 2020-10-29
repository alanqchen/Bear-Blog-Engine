import Layout from "../../../../../components/DashboardLayout/dashboardLayout";
import EditorsTable from "../../../../../components/EditorsTable/editorsTable";

const Index = () => {
  return (
    <Layout selectedCategory="Editors" skeletonType="table">
      <EditorsTable />
    </Layout>
  );
};

export default Index;
