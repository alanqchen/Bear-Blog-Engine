import Router from "next/router";
import Layout from "../../../../components/DashboardLayout/dashboardLayout";
import PostsList from "../../../../components/PostsTable/postsTable";
import {
  EditorButtonGroupWrapper,
  EditorButton,
} from "../../../../components/Editor/EditorStyled";
import { Add as AddIcon } from "@material-ui/icons";

const Index = () => {
  return (
    <Layout selectedCategory={"Posts"}>
      <EditorButtonGroupWrapper>
        <EditorButton
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => {
            Router.push("/auth/portal/dashboard/post");
          }}
          type="publish"
        >
          New Post
        </EditorButton>
      </EditorButtonGroupWrapper>
      <PostsList />
    </Layout>
  );
};

export default Index;
