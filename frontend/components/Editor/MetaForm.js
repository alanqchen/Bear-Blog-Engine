import Router from 'next/router';
import { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { 
    Typography,
    IconButton,
    LinearProgress,
    Button,
    Snackbar
} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
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
    EditorButtonOutlined,
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
import { split, join } from 'lodash';

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

export const MetaForm = ({ postData }) => {

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    // Both false -> use original, rm (false/true) new (true) -> upload new
    // rm (true) new (false) -> use default
    const [rmOrigFeatureImage, setRmOrigFeatureImage] = useState(false);
    const [uploadedNew, setUploadedNew] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isDraft, setIsDraft] = useState(true);

    const formRef = useRef();

    useEffect(() => {

    }, [rmOrigFeatureImage, uploadedNew]);

    const doSave = async() => {

        let featureImageURL = "";

        // Upload new image if needed
        if(uploadedNew) {
            let formData = new FormData();
            console.log(formRef.current.values.featureImage);
            formData.append("image", formRef.current.values.featureImage, formRef.current.values.featureImage.name);
            
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/images/upload', {
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT"),
                },
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(async(json) => {
                if(json.success) {
                    featureImageURL = json.data.imageUrl;
                } else {
                    setIsError(true);
                    setMessage(json.message);
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                setIsError(true);
                setMessage("Failed to save! Couldn't upload feature image");
                setSnackbarOpen(true);
                console.log(error);
            });
        } else if(!rmOrigFeatureImage && !uploadedNew) {
            featureImageURL = postData.featureImgUrl;
        }

        // tags formatting
        console.log(formRef.current.values.tags)
        let tags = split(formRef.current.values.tags, '\\\\');
        console.log(tags);
        if(tags[0] === '') {
            tags = [];
        }

        const params = {
            title: formRef.current.values.title,
            subtitle: formRef.current.values.subtitle,
            body: localStorage.getItem("bearpost.saved"),
            tags: tags,
            hidden: isDraft,
            featureImgUrl: featureImageURL
        }

        const reqSlug = postData ? '/' + postData.id : '';

        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts' + reqSlug, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT"),
            },
            method: postData ? 'PUT' : 'POST',
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(async(json) => {
            if(json.success) {
                setIsError(false);
                if(postData) {
                    setMessage("Saved successfully!");
                    setSnackbarOpen(true);
                } else {
                    setMessage("Created successfully! Redirecting in 2 seconds...");
                    setSnackbarOpen(true);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    Router.push("/auth/portal/dashboard/post/" + json.data.slug);
                }
            } else {
                setIsError(true);
                setMessage(json.message);
                setSnackbarOpen(true);
            }
        })
        .catch(error => {
            setIsError(true);
            if(postData) {
                setMessage("Failed to save!");
            } else {
                setMessage("Failed to create new post!");
            }
            setSnackbarOpen(true);
            console.log(error);
        });
    };

    return (
        <>
            <Formik
                innerRef={formRef}
                initialValues={{
                    title: postData ? postData.title : '',
                    subtitle: postData ? postData.subtitle : '',
                    tags: postData ? join(postData.tags, '\\\\') : '',
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
                    await new Promise(r => setTimeout(r, 500));
                    await doSave();
                }}
            >
            {({ values, submitForm, isSubmitting, setFieldValue, errors }) => (
                <StyledForm>
                    <EditorButtonGroupWrapper>
                        <EditorButtonOutlined
                            variant="outlined"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            type="danger"
                        >
                            Delete
                        </EditorButtonOutlined>
                        <EditorButton
                            variant="contained"
                            color="secondary"
                            startIcon={<SaveIcon />}
                            onClick={() => {
                                setIsDraft(true);
                                submitForm();
                            }}
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Save
                        </EditorButton>
                        <EditorButton
                            variant="contained"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {
                                setIsDraft(false);
                                submitForm();
                            }}
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
                            <Field
                                component={TextField}
                                name="tags"
                                type="tags"
                                label="Tags (seperated by \\)"
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
                                {postData && rmOrigFeatureImage && 
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
                            {postData && !rmOrigFeatureImage && !uploadedNew &&
                            <StyledImageWrapper>
                                <StyledImage src={process.env.NEXT_PUBLIC_API_URL + postData.featureImgUrl} />
                            </StyledImageWrapper>
                            }
                        </FieldWrapper>
                        {isSubmitting && <LinearProgress />}
                    </WidthWrapper>
                </StyledForm>
            )}
            </Formik>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity={isError ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default MetaForm;
