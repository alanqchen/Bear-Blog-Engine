import { useEffect, useState } from 'react';
import Router from 'next/router';
import { Fab, Typography, Divider, Button, Icon } from '@material-ui/core';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import fetch from 'isomorphic-unfetch';
import Editor from '../../../../../components/Editor/Editor';
import MetaForm from '../../../../../components/Editor/MetaForm';
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
        const savedPath = localStorage.getItem("bearpost.savePath");
        if (savedPath && savedPath === "/") {
            const savedText = localStorage.getItem("bearpost.saved");
            console.log(savedText);
            if(savedText) {
                setEditorValue(savedText);
            }
            console.log("setting");
        }
        localStorage.setItem("bearpost.savePath", "/");
        setInitialLoad(false);
        setLoaded(true);
    }, []);
    
    return (
        <Layout>
            {/*
            <StyledFab aria-label="save">
                <SaveIcon color="action" />
            </StyledFab>
            */}
            <WaveButton onClick={() => {setIsPreview(!isPreview)}}>Toggle Preview</WaveButton>
            <MetaForm />
            <WidthWrapper>
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
