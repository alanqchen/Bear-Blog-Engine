import { connect } from 'react-redux';
import Router from "next/router";
import { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, InputAdornment, LinearProgress } from '@material-ui/core';
import { Person, Lock, Toys, DonutLargeOutlined } from '@material-ui/icons';
import { WaveButton } from '../Theme/StyledComponents';
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import {
    StyledTextField,
    FormWrapper
} from './loginStyled';
import { login } from '../../redux/auth/actions';

export const SetupForm = ({ auth, dispatch }) => {

    const [passedCaptcha, setPassedCaptcha] = useState(false);
    const [failedCaptcha, setFailedCaptcha] = useState(false);

    const recaptchaRef = useRef();

    const doLogin = async(username, password) => {
        setPassedCaptcha(true);
        setFailedCaptcha(false);
        await dispatch(login(username, password)); 
    };

    useEffect(() => {
        if(passedCaptcha && auth.accessToken != "" && !auth.error) {
            Router.push("/auth/portal/dashboard");
        }
    })

    return (
        <FormWrapper>
            <Formik
                initialValues={{
                    name: '',
                    username: '',
                    password: '',
                    passwordConfirm: ''
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                    .required("Required"),
                    username: Yup.string()
                    .required("Required"),
                    password: Yup.string()
                    .required("Required"),
                    passwordConfirm: Yup.string()
                    .oneOf([Yup.ref('password'), null])
                    .required('Password confirm is required')
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
                <Form>
                    <Field
                        component={StyledTextField}
                        name="name"
                        type="name"
                        label="Name"
                        variant="outlined" 
                    />
                    <Field
                        component={StyledTextField}
                        name="username"
                        type="username"
                        label="Username"
                        variant="outlined" 
                    />
                    <Field
                        component={StyledTextField}
                        type="password"
                        label="Password"
                        name="password"
                        variant="outlined" 
                    />
                    <Field
                        component={StyledTextField}
                        name="passwordConfirm"
                        type="passwordConfirm"
                        label="Confirm Password"
                        variant="outlined" 
                    />
                    {isSubmitting && <LinearProgress />}
                    {failedCaptcha && <p>Failed Captcha. Try again.</p>}
                    {auth.error && <Typography variant="body1" color="error">Failed to create admin. Try again.</Typography>}
                    <WaveButton
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                    Submit
                    </WaveButton>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                        onChange={async() => {await doLogin(values.username, values.password)}}
                        onErrored={() => {setFailedCaptcha(true)}}
                    />
                </Form>
            )}
            </Formik>
        </FormWrapper>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: {
            accessToken: state.auth.accessToken,
            refreshToken: state.auth.refreshToken,
            userData: state.auth.userData,
            loading: state.auth.loading,
            error: state.auth.error
        },
    }
}

export default connect(mapStateToProps)(SetupForm);
