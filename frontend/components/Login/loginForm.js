import React, { useEffect, useState } from 'react';
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
                        <StyledTextField name="email" label="Email" variant="outlined" 
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
                                !touched.email || !touched.password || errors.email || errors.password
                            }
                        >
                            Login
                        </WaveButton>
                    </>
                );
            }}
        </Formik>
    );
}
export default LoginForm;
