import { StyledEditor } from '../../../../../components/Editor/EditorStyled';
import { TextField } from '@material-ui/core';
import { Typography, Divider } from '@material-ui/core';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import EditorTheme from '../../../../../components/Theme/editorTheme';

const Index = () => {
    return (
        <Layout>
            <WidthWrapper>
                <InputsWrapper>
                    <TextField name="title" label="Title" />
                    <TextField name="subtitle" label="Subtitle" />
                </InputsWrapper>
                <Divider />
                <StyledEditor 
                    theme={EditorTheme}
                    onClickHashtag={tag => {
                        history.push(`/category/${tag}`);
                    }}
                />
            </WidthWrapper>
        </Layout>
    );
};

export default Index;
