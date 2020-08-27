import Router from 'next/router';
import { useEffect, useState } from 'react';
import { WidthWrapper } from '../DashboardLayout/dashboardLayoutStyled';
import { Divider, Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Editor from './Editor';
import MetaForm from './MetaForm';

const EditorWrapper = ({ query }) => {
    console.log("Printing...")
    console.log(query);

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setShowMessage(false);
    };

    const [loaded, setLoaded] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            console.log("In use")
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/admin/${query.year}/${query.month}/${query.slug}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT")
                }
            })
            .then(res => res.json())
            .then(async(json) => {
                if(json.success) {
                    setIsError(false);
                    setMessage("Found post!");
                    setShowMessage(true);
                    setLoaded(true);
                } else {
                    setIsError(true);
                    setMessage(json.message + " Returning to dashboard...");
                    setShowMessage(true);
                    await new Promise(r => setTimeout(r, 2000));
                    Router.push("/auth/portal/dashboard");
                }
            })
            .catch(async() => {
                setIsError(true);
                setMessage("Failed to get post. Returning to dashboard...");
                setShowMessage(true);
                await new Promise(r => setTimeout(r, 2000));
                Router.push("/auth/portal/dashboard");
            });
        }
        fetchPost();
    }, []);

    return (
        <>
            {loaded &&
            <>
                <MetaForm />
                <WidthWrapper>
                    <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
                        <Editor defaultValue={''} isPreview={false} />
                    <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
                </WidthWrapper>
            </>
            }
            <Snackbar open={showMessage} autoHideDuration={6000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity={isError ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default EditorWrapper;
