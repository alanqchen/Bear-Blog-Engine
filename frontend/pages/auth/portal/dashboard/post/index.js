import Editor from 'rich-markdown-editor';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import EditorTheme from '../../../../../components/Theme/editorTheme';

const Index = () => {
    return (
        <Layout> 
            <Editor 
                theme={EditorTheme}
                style={{maxWidth: '800px', width: '100%'}}
            />
        </Layout>
    );
};

export default Index;
