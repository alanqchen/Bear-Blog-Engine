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
import fetch from 'isomorphic-unfetch';
import Editor from '../../../../../components/Editor/Editor';
import { StyledFab, EditorButtonGroupWrapper, EditorButton, EditorButtonOutlined } from '../../../../../components/Editor/EditorStyled';
import { WaveButton } from '../../../../../components/Theme/StyledComponents';

const Index = () => {

    const [isPreview, setIsPreview] = useState(false);
    const [editorValue, setEditorValue] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        console.log("In use")
        const savedText = localStorage.getItem("bearpost.saved");
        console.log(savedText)
        if(savedText) {
            setEditorValue(savedText);
        }
        console.log("setting")
        setInitialLoad(false);
        setLoaded(true);
    }, []);

    const doSave = (isDraft) => {

        const params = {
            title: "Temp",
            subtitle: "Temp",
            body: "temp",
            tags: ["temp", "temp2"],
            hidden: isDraft,
            featureImgUrl: ""
        }

        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts', {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(async(json) => {
            if(json.success) {
                setShowError(false);
                setMsg("Created admin! Reloading in 5 seconds...");
                setOpen(true);
            } else {
                setErrMsg(json.message);
                setShowError(true);
            }
        })
        .catch(error => {
            setErrMsg("Failed to save");
            setShowError(true);
            console.log(error);
        });
    }

    return (
        <Layout>
            {/*
            <StyledFab aria-label="save">
                <SaveIcon color="action" />
            </StyledFab>
            */}
            <WaveButton onClick={() => {setIsPreview(!isPreview)}}>Toggle Preview</WaveButton>
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
                <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
                {console.log(loaded)}
                {loaded && <Editor defaultValue={editorValue} isPreview={isPreview} />
                }
                <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
            </WidthWrapper>
        </Layout>
    );
};

export default Index;
