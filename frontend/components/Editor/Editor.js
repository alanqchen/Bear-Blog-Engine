import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { debounce } from 'lodash';
import { StyledEditor, StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from './EditorStyled';
import EditorTheme from '../Theme/editorTheme';
import { WaveButton } from '../Theme/StyledComponents';

// SNACKBAR FUNCS

function CustAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

// EDITOR FUNCS

function YoutubeEmbed(props) {
    return (
        <StyledYoutubeEmbedWrapper>
            <StyledYoutubeEmbed
                src={`https://www.youtube.com/embed/${props.attrs.matches[1]}?modestbranding=1`}
            />
        </StyledYoutubeEmbedWrapper>
    );
}

const handleChange = debounce(value => {
    const text = value();
    console.log(text);
    localStorage.setItem("bearpost.saved", text);
}, 1000);

function Editor({ defaultValue, isPreview }) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // SNACKBAR CLOSE
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    return (
        <>
            <StyledEditor 
                theme={EditorTheme}
                onClickHashtag={tag => {
                    history.push(`/category/${tag}`);
                }}
                onShowToast={(message, id) => {
                    setErrorMsg(message + " (" + id + ")");
                    setSnackbarOpen(true);
                }}
                readOnly={isPreview}
                defaultValue={defaultValue}
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
                <CustAlert onClose={handleClose} severity="error">
                    {errorMsg}
                </CustAlert>
            </Snackbar>
            <WaveButton onClick={() => {setSnackbarOpen(true)}}>Test Snackbar</WaveButton>
            <WaveButton onClick={() => {setSnackbarOpen(true)}}>Save</WaveButton>
        </>
    );
}

export default Editor;
