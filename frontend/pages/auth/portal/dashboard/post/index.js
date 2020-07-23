import Editor from 'rich-markdown-editor';
import { TextField } from '@material-ui/core';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import EditorTheme from '../../../../../components/Theme/editorTheme';

const Index = () => {
    return (
            <Layout>
                <InputsWrapper>
                    <TextField name="title" label="Title" />
                    <TextField name="subtitle" label="Subtitle" />
                </InputsWrapper>
                <Editor 
                    theme={EditorTheme}
                    style={{maxWidth: '800px', width: '100%'}}
                    onClickHashtag={tag => {
                        history.push(`/category/${tag}`);
                    }}
                />
            </Layout>
    );
};

export default Index;
