import Editor from 'rich-markdown-editor';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import EditorTheme from '../../../../../components/Theme/editorTheme';

const Index = () => {
    return (
        <Layout> 
            <Editor 
                theme={EditorTheme}
            />
        </Layout>
    );
};

export default Index;
