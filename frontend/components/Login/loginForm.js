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

export const LoginForm = ({ auth, dispatch }) => {

    const [passedCaptcha, setPassedCaptcha] = useState(false);
    const [failedCaptcha, setFailedCaptcha] = useState(false);

    const recaptchaRef = useRef();

    const doLogin = async(username, password) => {
        setPassedCaptcha(true);
        setFailedCaptcha(false);
        await dispatch(login(username, password)); 
    };

    return (
        <FormWrapper>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                    .required("Required"),
                    password: Yup.string()
                    .required("Required")
                })}
                onSubmit={async (values, { setSubmitting }) => {
                        if(passedCaptcha) {
                            await doLogin(values.username, values.password);
                        } else {
                            recaptchaRef.current.execute();
                        }
                        setSubmitting(false);
                        if(!auth.error) {
                            Router.push("/auth/portal/dashboard");
                        }
                }}
            >
            {({ values, submitForm, isSubmitting }) => (
                <Form>
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
                    {isSubmitting && <LinearProgress />}
                    {failedCaptcha && <p>Failed Captcha. Try again.</p>}
                    {auth.error && <Typography variant="body1" color="error">Failed to login. Try again.</Typography>}
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

export default connect(mapStateToProps)(LoginForm);
