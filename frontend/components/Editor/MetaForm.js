import Router from 'next/router';
import { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { 
    Typography,
    IconButton,
    LinearProgress,
    TextField,
    Button,
    Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';
import fetch from 'isomorphic-unfetch';
import { WaveButton } from '../Theme/StyledComponents';
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { 
    EditorButtonGroupWrapper,
    EditorButton,
    StyledForm,
    FieldWrapper,
    LocalFeatureImageWrapper,
    StyledImageWrapper,
    StyledImage,
    ImageInputWrapper
} from './EditorStyled';
import { login } from '../../redux/auth/actions';
import FeatureImage from '../Posts/Page/PostCard/featureImage';
import { WidthWrapper } from '../DashboardLayout/dashboardLayoutStyled';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { FormData } from 'form-data';

export const ImagePreview = ({ file }) => {

    const [image, setImage] = useState(null);

    const isFirstRun = useRef(true);
    useEffect (() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (!file) {
            setImage(null);
            return;
        }

        let reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        reader.readAsDataURL(file);

    }, [file]);

    return (
        <>
            {image &&
                <LocalFeatureImageWrapper>
                    <StyledImageWrapper>
                        <StyledImage src={image} />
                    </StyledImageWrapper>
                </LocalFeatureImageWrapper>
            }
        </>
    );
}

export const MetaForm = ({ slug }) => {

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    const [originalFeatureImage, setOriginalFeatureImage] = useState("");
    // Both false -> use original, rm (false/true) new (true) -> upload new
    // rm (true) new (false) -> use default
    const [rmOrigFeatureImage, setRmOrigFeatureImage] = useState(false);
    const [uploadedNew, setUploadedNew] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const formRef = useRef();

    useEffect(() => {

    }, [rmOrigFeatureImage, uploadedNew]);

    const doSave = async() => {
        console.log(uploadedNew);
        console.log(rmOrigFeatureImage);
        let featureImageUrl = "";
        // TODO: Upload new image if needed
        if(uploadedNew) {
            const imageData = new FormData(formRef.current.values.featureImage)
            
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/images/upload', {
                headers: { 'Accept': 'application/json, */*' },
                method: 'POST',
                body: imageData
            })
            .then(res => res.json())
            .then(async(json) => {
                if(json.success) {

                }
            })
        }
        // TODO: If new post, use POST

        // TODO: If old post, use PUT
    };

    return (
        <>
            <Formik
                innerRef={formRef}
                initialValues={{
                    title: '',
                    subtitle: '',
                    featureImage: ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                    .required("Required"),
                    subtitle: Yup.string()
                    .required("Required")
                })}
                onSubmit={async(values, { setSubmitting }) => {
                    // Wait for 500ms so editor can save changes in localStorage
                    await sleep(500);
                    const editorVal = localStorage.getItem("bearpost.saved");

                    setSubmitting(false);
                }}
            >
            {({ values, submitForm, isSubmitting, setFieldValue }) => (
                <StyledForm>
                    <EditorButtonGroupWrapper>
                        <EditorButton
                            variant="contained"
                            color="secondary"
                            startIcon={<SaveIcon />}
                            onClick={async() => {await doSave()}}
                        >
                            Save
                        </EditorButton>
                        <EditorButton
                            variant="contained"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            type="publish"
                        >
                            Publish
                        </EditorButton>
                    </EditorButtonGroupWrapper>
                    <WidthWrapper>
                        <FieldWrapper>
                            <Field
                                component={TextField}
                                name="title"
                                type="title"
                                label="Title"
                                style={{marginBottom: "10px"}}
                            />
                            <Field
                                component={TextField}
                                name="subtitle"
                                type="subtitle"
                                label="Subtitle"
                                style={{marginBottom: "10px"}}
                            />
                            <input
                                name="featureImage"
                                type="featureImage"
                                onChange={(event) => {
                                    setFieldValue("featureImage", event.currentTarget.files[0]);
                                    if(event.currentTarget.files[0]) {
                                        setUploadedNew(true);
                                        setRmOrigFeatureImage(true);
                                    }
                                }}
                                accept="image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                                style={{ display: "none" }}
                            />
                            <ImageInputWrapper>
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                    Upload
                                    </Button>
                                </label>
                                <IconButton color="primary" aria-label="upload picture" component="span"
                                    onClick={() => {
                                        setUploadedNew(false);
                                        setRmOrigFeatureImage(true);
                                        setFieldValue("featureImage", '');
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                {slug && rmOrigFeatureImage && 
                                <Button variant="contained" color="primary" component="span"
                                    onClick={() => {
                                        setUploadedNew(false);
                                        setRmOrigFeatureImage(false);
                                        setFieldValue("featureImage", '');
                                    }}
                                >
                                    Restore Original
                                </Button>
                                }
                            </ImageInputWrapper>
                            <ImagePreview file={values.featureImage} />
                        </FieldWrapper>
                        {isSubmitting && <LinearProgress />}
                    </WidthWrapper>
                </StyledForm>
            )}
            </Formik>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>
    );
}

export default MetaForm;
