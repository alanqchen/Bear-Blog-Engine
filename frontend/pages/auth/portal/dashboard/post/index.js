import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Fab, Typography, Divider, Button, Icon } from '@material-ui/core';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import Editor from '../../../../../components/Editor/Editor';
import { StyledFab, EditorButtonGroupWrapper, EditorButton, EditorButtonOutlined } from '../../../../../components/Editor/EditorStyled';
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
            {/*
            <StyledFab aria-label="save">
                <SaveIcon color="action" />
            </StyledFab>
            */}
            <EditorButtonGroupWrapper>
                <EditorButtonOutlined
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    type="danger"
                >
                    Delete
                </EditorButtonOutlined>
                <EditorButton
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                >
                    Save
                </EditorButton>
                <EditorButton
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    type="publish"
                >
                    Publish
                </EditorButton>
            </EditorButtonGroupWrapper>
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
