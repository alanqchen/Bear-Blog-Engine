import {connect} from 'react-redux';
import { refresh } from '../../redux/auth/actions';
import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { debounce, throttle } from 'lodash';
import { StyledEditor, StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from './EditorStyled';
import EditorTheme from '../Theme/editorTheme';
import { WaveButton } from '../Theme/StyledComponents';
import { YoutubeEmbed } from './Embeds';

function Editor({ dispatch, defaultValue, isPreview, isNew }) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setSnackbarOpen(false);
    };

    // Refresh tokens every 30 seconds
    const handleAuthRefresh = throttle(() => {
        console.log("Refreshing tokens");
        dispatch(refresh());
    }, 30000);

    const handleChange = debounce(value => {
        if(isNew) {
            const text = value();
            localStorage.setItem("bearpost.saved", text);
        }
        handleAuthRefresh();
    }, 400);

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
                <Alert elevation={6} variant="filled" onClose={handleClose} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>
    );
}

export default connect()(Editor);
