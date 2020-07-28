import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, InputAdornment } from '@material-ui/core';
import { Person, Lock, Toys } from '@material-ui/icons';
import { WaveButton } from '../Theme/StyledComponents';
import { Formik } from "formik";
import * as Yup from "yup";
import {
    StyledTextField
} from './loginStyled';

export const LoginForm = () => {

    const [isActive, setIsActive] = useState(false);
    const [passedCaptcha, setPassedCaptcha] = useState(false);
    const [failedCaptcha, setFailedCaptcha] = useState(false);

    const recaptchaRef = useRef();

    useEffect(() => {}, [isActive]);

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
                            onClick={() => { recaptchaRef.current.execute() }}
                        >
                            Login
                        </WaveButton>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                            onChange={() => {setPassedCaptcha(true)}}
                            onErrored={() => {setFailedCaptcha(true)}}
                        />
                        {passedCaptcha && <p>Passed Captcha!</p>}
                        {failedCaptcha && <p>Couldn't complete captcha, try again.</p>}
                    </>
                );
            }}
        </Formik>
    );
}
export default LoginForm;
