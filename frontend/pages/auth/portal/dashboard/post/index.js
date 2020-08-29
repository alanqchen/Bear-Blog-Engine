import { useEffect, useState } from 'react';
import Router from 'next/router';
import { Fab, Typography, Divider, Button, Icon } from '@material-ui/core';
import { Visibility as VisibilityIcon } from '@material-ui/icons';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import fetch from 'isomorphic-unfetch';
import Editor from '../../../../../components/Editor/Editor';
import { StyledFab } from '../../../../../components/Editor/EditorStyled';
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
            <StyledFab aria-label="preview" onClick={() => {setIsPreview(!isPreview)}} >
                <VisibilityIcon color="action" />
            </StyledFab>
            <MetaForm />
            <WidthWrapper>
                <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
                {console.log(loaded)}
                {loaded && <Editor defaultValue={editorValue} isPreview={isPreview} isNew />
                }
                <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
            </WidthWrapper>
        </Layout>
    );
};

export default Index;
