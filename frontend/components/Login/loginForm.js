import {connect} from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, InputAdornment } from '@material-ui/core';
import { Person, Lock, Toys, DonutLargeOutlined } from '@material-ui/icons';
import { WaveButton } from '../Theme/StyledComponents';
import { Formik, Field } from "formik";
import * as Yup from "yup";
import {
    StyledTextField
} from './loginStyled';
import { login } from '../../redux/auth/actions';

export const LoginForm = ({ dispatch }) => {

    const [isActive, setIsActive] = useState(false);
    const [passedCaptcha, setPassedCaptcha] = useState(false);
    const [failedCaptcha, setFailedCaptcha] = useState(false);

    const recaptchaRef = useRef();

    useEffect(() => {}, [isActive]);

    const doLogin = async(username, password) => {
        setPassedCaptcha(true);
        console.log("Dispatching...");
        await dispatch(login(username, password));   
        recaptchaRef.current.reset();
    };

    const submitLogin = (username, password) => {
        console.log("Logging in");
        recaptchaRef.current.execute();
    };

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                console.log("Logging in", values);
                setSubmitting(false);
            }, 500);
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                .email()
                .required("Required"),
                password: Yup.string()
                .required("Required")
            })}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                } = props;
                return (
                    <>
                        <StyledTextField name="email" label="Email or Username" variant="outlined" 
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email && touched.email}
                            helperText={errors.email && touched.email && errors.email}
                        />
                        <StyledTextField name="password" label="Password" type="password" variant="outlined" 
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password && touched.password}
                            helperText={errors.password && touched.password && errors.password}
                        />
                        <WaveButton variant="contained" color="primary" disabled={
                                (!touched.email || !touched.password || errors.email || errors.password) ? true : false
                            }
                            onClick={() => { submitLogin(values.email, values.password) }}
                        >
                            Login
                        </WaveButton>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                            onChange={() => {doLogin(values.email, values.password)}}
                            onErrored={() => {setFailedCaptcha(true)}}
                        />
                        {failedCaptcha && <p>Couldn't complete captcha, try again.</p>}
                    </>
                );
            }}
        </Formik>
    );
}

const FormikMUIInput = ({ name }) => (
    <Field name={name}>
    {({ field: { value }, form: { setFieldValue } }) => (
        <StyledTextField name="password" label="Password" type="password" variant="outlined" 
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Lock />
                    </InputAdornment>
                ),
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password && touched.password}
            helperText={errors.password && touched.password && errors.password}
        />
    )}
    </Field>
);

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
