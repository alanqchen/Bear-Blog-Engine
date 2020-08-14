import { StyledEditor, StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from '../../../../../components/Editor/EditorStyled';
import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Typography, Divider, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Layout from '../../../../../components/DashboardLayout/dashboardLayout';
import {
    WidthWrapper,
    InputsWrapper
} from '../../../../../components/DashboardLayout/dashboardLayoutStyled';
import { debounce } from 'lodash';
import { WaveButton } from '../../../../../components/Theme/StyledComponents';
import EditorTheme from '../../../../../components/Theme/editorTheme';

function CustAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

function YoutubeEmbed(props) {
    return (
        <StyledYoutubeEmbedWrapper>
            <StyledYoutubeEmbed
                src={`https://www.youtube.com/embed/${props.attrs.matches[1]}?modestbranding=1`}
            />
        </StyledYoutubeEmbedWrapper>
    );
}
  

const Index = () => {

    const [isPreview, setIsPreview] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [editorValue, setEditorValue] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChange = debounce(value => {
        const text = value();
        console.log(text);
        localStorage.setItem("bearpost.saved", text);
    }, 1000);

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
                {!initialLoad && <StyledEditor 
                    theme={EditorTheme}
                    onClickHashtag={tag => {
                        history.push(`/category/${tag}`);
                    }}
                    onShowToast={(message, id) => {
                        setErrorMsg(message + " (" + id + ")");
                        setOpen(true);
                    }}
                    readOnly={isPreview}
                    defaultValue={editorValue}
                    onChange={handleChange}
                    embeds={[
                        {
                            title: "YouTube",
                            keywords: "youtube video tube google",
                            icon: () => (
                                <img src="/YouTube_white_squircle.svg" width={24} height={24} />
                            ),
                            matcher: url => {
                                return url.match(
                                  /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
                                );
                            },
                            component: YoutubeEmbed,
                        }
                    ]}
                />
                }
                <WaveButton onClick={() => {setIsPreview(!isPreview)}}>Toggle Preview</WaveButton>
                <WaveButton onClick={() => {setOpen(true)}}>Test Snackbar</WaveButton>
                <WaveButton onClick={() => {setOpen(true)}}>Save</WaveButton>
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
