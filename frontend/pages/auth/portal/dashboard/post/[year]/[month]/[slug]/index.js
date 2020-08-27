import { StyledFab, EditorButtonGroupWrapper, EditorButton, EditorButtonOutlined } from '../../../../../../../../components/Editor/EditorStyled';
import Layout from '../../../../../../../../components/DashboardLayout/dashboardLayout';
import EditorWrapper from '../../../../../../../../components/Editor/EditorWrapper';

const Index = ({ auth, dispatch, query }) => {
    
    return (
        <Layout selectedCategory={"None"}>
            <EditorWrapper query={query}/>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    return {
      props: {
          query: context.query
      },
    }
}

export default Index;
