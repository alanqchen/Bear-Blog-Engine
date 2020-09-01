import { connect } from "react-redux";
import Router from "next/router";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Typography, Snackbar, LinearProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { WaveButton } from "../Theme/StyledComponents";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import fetch from "isomorphic-unfetch";
import { StyledTextField, FormWrapper } from "./loginStyled";

function CustAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

export const SetupForm = ({ auth }) => {
  const [passedCaptcha, setPassedCaptcha] = useState(false);
  const [failedCaptcha, setFailedCaptcha] = useState(false);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [msg, setMsg] = useState("");

  const recaptchaRef = useRef();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const doSetup = async (name, username, password) => {
    setPassedCaptcha(true);
    setFailedCaptcha(false);

    const params = {
      name: name,
      username: username,
      password: password,
    };

    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/users/setup", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (json.success) {
          setIsError(false);
          setMsg("Created admin! Reloading in 5 seconds...");
          setOpen(true);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          Router.push("/auth/portal/login");
        } else {
          setIsError(true);
          setMsg(json.message);
          setOpen(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <FormWrapper>
        <Formik
          initialValues={{
            name: "",
            username: "",
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Required"),
            username: Yup.string().required("Required"),
            password: Yup.string().required("Required"),
            passwordConfirm: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            if (passedCaptcha) {
              await doSetup(values.username, values.password);
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
                name="password"
                type="password"
                label="Password"
                variant="outlined"
              />
              <Field
                component={StyledTextField}
                name="passwordConfirm"
                type="password"
                label="Confirm Password"
                variant="outlined"
              />
              {isSubmitting && <LinearProgress />}
              {failedCaptcha && <p>Failed Captcha. Try again.</p>}
              {auth.error && (
                <Typography variant="body1" color="error">
                  Failed to create admin. Try again.
                </Typography>
              )}
              <WaveButton
                type="submit"
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
                onChange={async () => {
                  await doSetup(values.name, values.username, values.password);
                }}
                onErrored={() => {
                  setFailedCaptcha(true);
                }}
              />
            </Form>
          )}
        </Formik>
      </FormWrapper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {isError ? (
          <CustAlert onClose={handleClose} severity="error">
            {msg}
          </CustAlert>
        ) : (
          <CustAlert onClose={handleClose} severity="success">
            {msg}
          </CustAlert>
        )}
      </Snackbar>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: {
      accessToken: state.auth.accessToken,
      refreshToken: state.auth.refreshToken,
      userData: state.auth.userData,
      loading: state.auth.loading,
      error: state.auth.error,
    },
  };
};

export default connect(mapStateToProps)(SetupForm);
