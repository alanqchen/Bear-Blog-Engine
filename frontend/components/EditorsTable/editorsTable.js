import {connect} from 'react-redux';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    LinearProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add as AddIcon } from '@material-ui/icons';
import {
    StatusChip,
    EditorsTableRow,
    EditorsTableContainer,
    EditorsTableHead
} from './editorsTableStyled';
import { EditorButtonGroupWrapper, EditorButton } from '../Editor/EditorStyled';
import { timestamp2date } from '../utils/helpers';

function EditorsTable({ auth, dispatch }) {

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    const [loaded, setLoaded] = useState(false);
    const [editors, setEditors] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [userEdit, setUserEdit] = useState({});
    const [showDialogErr, setShowDialogErr] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=> {

        const getUsers = async() => {
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users/detailed', {
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT"),
                }
            })
            .then(res => res.json())
            .then(json => {
                if(json.success) {
                    setEditors(json.data);
                    setLoaded(true);
                } else {
                    setIsError(true);
                    setMessage(json.message);
                    setSnackbarOpen(true);
                }
            })
            .catch(() => {
                setIsError(true);
                setMessage("Failed to get editors!");
                setSnackbarOpen(true);
            })
        }

        console.log("In effect")

        getUsers();

    }, [refresh]);

    const editUser = async(name, username, password, admin) => {
        console.log(admin)
        const params = {
            name: name,
            username: username,
            password: password,
            admin: admin
        };

        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users', {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT"),
            },
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(async(json) => {
            if(json.success) {
                setIsError(false);
                setMessage("Created editor!");
                setSnackbarOpen(true);
                setShowDialog(false);
                setRefresh(!refresh);
            } else {
                setIsError(true);
                setMessage(json.message);
                setSnackbarOpen(true);
            }
        })
        .catch(() => {
            setIsError(true);
            setMessage("Failed to create/update editor!");
            setSnackbarOpen(true);
        });
    };

    return (
        <>
            {auth.userData && auth.userData.admin && 
            <EditorButtonGroupWrapper noBottomMargin>
                <EditorButton
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setUserEdit(null);
                        setShowDialog(true);
                    }}
                    type="publish"
                >
                    New User
                </EditorButton>
            </EditorButtonGroupWrapper>
            }
            <EditorsTableContainer component={Paper} style={{marginTop: "20px"}}>
                <Table aria-label="editors table">
                    <EditorsTableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </EditorsTableHead>
                    <TableBody>
                        {loaded && auth.userData && editors.map((user, i) => (
                            <EditorsTableRow hover={auth.userData.admin} key={i}
                                pointer={auth.userData.admin ? "1" : undefined}
                                onClick={() => {
                                    setUserEdit(user);
                                }}
                            >
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{timestamp2date(user.createdAt)}</TableCell>
                                <TableCell>{user.admin ? "Admin" : "Editor"}</TableCell>
                            </EditorsTableRow>
                        ))}
                    </TableBody>
                </Table>
            </EditorsTableContainer>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity={isError ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>


            <Dialog
                open={showDialog}
                onClose={()=>{setShowDialog(false)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="form-dialog-title">Create New Editor</DialogTitle>
                <Formik
                    initialValues={{
                        name: '',
                        username: '',
                        password: '',
                        passwordConfirm: '',
                        admin: false
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string()
                        .required("Required"),
                        username: Yup.string()
                        .required("Required"),
                        password: Yup.string()
                        .required("Required"),
                        passwordConfirm: Yup.string()
                        .oneOf([Yup.ref('password')], "Passwords must match")
                        .required("Required")
                    })}
                    onSubmit={async(values, { setSubmitting }) => {
                            if(!userEdit) {
                                console.log("Calling edit user")
                                await editUser(values.name, values.username, values.password, values.admin);
                            } else {
                                
                            }
                            setSubmitting(false);
                    }}
                >
                {({ values, submitForm, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                The username cannot be changed once created.
                            </DialogContentText>
                            <Field
                                component={TextField}
                                name="name"
                                type="name"
                                label="Name"
                                fullWidth
                            />
                            <Field
                                component={TextField}
                                name="username"
                                type="username"
                                label="Username"
                                fullWidth
                            />
                            <Field
                                component={TextField}
                                name="password"
                                type="password"
                                label="Password"
                                fullWidth
                            />
                            <Field
                                component={TextField}
                                name="passwordConfirm"
                                type="password"
                                label="Confirm Password"
                                fullWidth
                            />
                            <Field
                                component={CheckboxWithLabel}
                                name="admin"
                                type="checkbox"
                                Label={{ label: 'Admin' }}
                            />
                            {isSubmitting && <LinearProgress />}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {setShowDialog(false)}} color="primary" disabled={isSubmitting} autoFocus>
                                Cancel
                            </Button>
                            <Button color="primary" disabled={isSubmitting}
                                onClick={() => {
                                    setShowDialog(false);
                                }} 
                            >
                                Delete
                            </Button>
                            <Button color="primary" type="submit" disabled={isSubmitting}
                                onClick={() => {
                                    submitForm();
                                }} 
                            >
                                Create
                            </Button>
                        </DialogActions>
                        </Form>
                )}
                </Formik>
            </Dialog>
            
        </>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: {
            loading: state.auth.loading,
            userData: state.auth.userData
        }
    }
}

export default connect(mapStateToProps)(EditorsTable);
