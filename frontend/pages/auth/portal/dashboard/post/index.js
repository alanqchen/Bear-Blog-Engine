import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Typography, Divider, Snackbar } from '@material-ui/core';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import Editor from '../../../../../components/Editor/Editor';
import { WaveButton } from '../../../../../components/Theme/StyledComponents';

const Index = () => {

    const [isPreview, setIsPreview] = useState(false);
    const [editorValue, setEditorValue] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const savedText = localStorage.getItem("bearpost.saved");
        console.log(savedText)
        if(savedText) {
            setEditorValue(savedText);
        }
        setInitialLoad(false);
    }, []);

    return (
        <Layout>
            <WidthWrapper>
                <InputsWrapper>
                    <TextField name="title" label="Title" />
                    <TextField name="subtitle" label="Subtitle" />
                </InputsWrapper>
                <Divider />
                {!initialLoad && <Editor defaultValue={editorValue} isPreview={isPreview} />
                }
                <WaveButton onClick={() => {setIsPreview(!isPreview)}}>Toggle Preview</WaveButton>
            </WidthWrapper>
        </Layout>
    );
};

export default Index;
