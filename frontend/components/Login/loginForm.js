import { connect } from "react-redux";
import Router from "next/router";
import { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import fetch from "isomorphic-unfetch";
import { Typography, LinearProgress } from "@material-ui/core";
import { WaveButton } from "../Theme/StyledComponents";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { StyledTextField, FormWrapper } from "./loginStyled";
import { login } from "../../redux/auth/actions";

export const LoginForm = ({ auth, dispatch }) => {
  // We need both since both will be false until the first form submit
  const [passedCaptcha, setPassedCaptcha] = useState(false);
  const [failedCaptcha, setFailedCaptcha] = useState(false);

  const recaptchaRef = useRef();

  const doLogin = async (username, password) => {
    await dispatch(login(username, password));
  };

  const verifyToken = async (token) => {
    const params = {
      token: token,
    };

    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/verify", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (json.success) {
          setPassedCaptcha(true);
          setFailedCaptcha(false);
          await doLogin();
        } else {
          setPassedCaptcha(false);
          setFailedCaptcha(true);
        }
      })
      .catch(() => {
        console.log("Failed to call verify API");
        setPassedCaptcha(false);
        setFailedCaptcha(true);
      });
  };

  useEffect(() => {
    if (
      passedCaptcha &&
      !auth.loading &&
      auth.accessToken !== "" &&
      !auth.error
    ) {
      Router.push("/auth/portal/dashboard");
    }
  });

  return (
    <FormWrapper>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={async (values) => {
          if (passedCaptcha) {
            await doLogin(values.username, values.password);
          } else {
            const token = await recaptchaRef.current.executeAsync();
            await verifyToken(token);
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
              name="password"
              type="password"
              label="Password"
              variant="outlined"
            />
            {isSubmitting && <LinearProgress />}
            {failedCaptcha && <p>Failed Captcha. Try again.</p>}
            {auth.error && (
              <Typography variant="body1" color="error">
                Failed to login. Try again.
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
                await doLogin(values.username, values.password);
              }}
              onErrored={() => {
                setFailedCaptcha(true);
              }}
            />
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

const mapStateToProps = (state, ownProps) => {
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

export default connect(mapStateToProps)(LoginForm);
