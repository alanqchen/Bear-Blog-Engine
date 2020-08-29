import {connect} from 'react-redux';
import { refresh } from '../../redux/auth/actions';
import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { debounce, throttle } from 'lodash';
import { StyledEditor, StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from './EditorStyled';
import EditorTheme from '../Theme/editorTheme';
import { WaveButton } from '../Theme/StyledComponents';
import { EmbedsArray } from './Embeds';

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
                embeds={EmbedsArray}
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
