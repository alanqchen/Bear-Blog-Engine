import Router from 'next/router';
import { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, InputAdornment, LinearProgress, TextField } from '@material-ui/core';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';
import { WaveButton } from '../Theme/StyledComponents';
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { EditorButtonGroupWrapper, EditorButton, StyledForm, FieldWrapper } from './EditorStyled';
import { login } from '../../redux/auth/actions';

export const MetaForm = ({ isNew }) => {

    const doSave = async() => {
    };

    return (
        <>
            <Formik
                initialValues={{
                    title: '',
                    subtitle: '',
                    imageURL: ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                    .required("Required"),
                    subtitle: Yup.string()
                    .required("Required")
                })}
                onSubmit={async(values, { setSubmitting }) => {
                        if(passedCaptcha) {
                            await doLogin(values.username, values.password);
                        } else {
                            await recaptchaRef.current.executeAsync();
                        }
                        setSubmitting(false);
                }}
            >
            {({ values, submitForm, isSubmitting }) => (
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
                    </FieldWrapper>
                    {isSubmitting && <LinearProgress />}
                </StyledForm>
            )}
            </Formik>
        </>
    );
}

export default MetaForm;
