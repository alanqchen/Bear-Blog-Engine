import { StyledEditor } from '../../../../../components/Editor/EditorStyled';
import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Typography, Divider, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import { WaveButton } from '../../../../../components/Theme/StyledComponents';
import EditorTheme from '../../../../../components/Theme/editorTheme';

function CustAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

const Index = () => {

    const [isPreview, setIsPreview] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    useEffect(() => {}, [isPreview]);

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
                    onShowToast={(message, id) => {
                        setErrorMsg(message + "(" + id + ")");
                        setOpen(true);
                    }}
                    readOnly={isPreview}
                />
                <WaveButton onClick={() => {setIsPreview(!isPreview)}}>Toggle Preview</WaveButton>
                <WaveButton onClick={() => {setOpen(true)}}>Test Snackbar</WaveButton>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <CustAlert onClose={handleClose} severity="error">
                        {errorMsg}
                    </CustAlert>
                </Snackbar>
            </WidthWrapper>
        </Layout>
    );
};

export default Index;
