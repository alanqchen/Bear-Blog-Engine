import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { StyledEditor } from './EditorStyled';
import EditorTheme from '../Theme/editorTheme';
import { EmbedsArray } from './Embeds';

function ReadOnlyEditor({ defaultValue }) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");

    // SNACKBAR
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
                onShowToast={(mssg, id) => {
                    setMessage(mssg);
                    setSnackbarOpen(true);
                }}
                readOnly={true}
                defaultValue={defaultValue}
                embeds={EmbedsArray}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ReadOnlyEditor;
