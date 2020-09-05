import Router from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  IconButton,
  LinearProgress,
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Alert } from "@material-ui/lab";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@material-ui/icons";
import fetch from "isomorphic-unfetch";
import { Formik, Field } from "formik";
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
  ImageInputWrapper,
} from "./EditorStyled";
import { WidthWrapper } from "../DashboardLayout/dashboardLayoutStyled";
import { split, join } from "lodash";

export const ImagePreview = ({ file }) => {
  const [image, setImage] = useState(null);

  const isFirstRun = useRef(true);
  useEffect(() => {
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
      {image && (
        <LocalFeatureImageWrapper>
          <StyledImageWrapper>
            <StyledImage src={image} />
          </StyledImageWrapper>
        </LocalFeatureImageWrapper>
      )}
    </>
  );
};

export const MetaForm = ({ postData, disableButtons }) => {
  // SNACKBAR
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
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
  const [showDialog, setShowDialog] = useState(false);

  const formRef = useRef();

  useEffect(() => {}, [rmOrigFeatureImage, uploadedNew]);

  const doSave = async () => {
    let featureImageURL = "";

    // Upload new image if needed
    if (uploadedNew) {
      let formData = new FormData();
      console.log(formRef.current.values.featureImage);
      formData.append(
        "image",
        formRef.current.values.featureImage,
        formRef.current.values.featureImage.name
      );

      await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/images/upload", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
        },
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(async (json) => {
          if (json.success) {
            featureImageURL = json.data.imageUrl;
          } else {
            setIsError(true);
            setMessage(json.message);
            setSnackbarOpen(true);
          }
        })
        .catch(() => {
          setIsError(true);
          setMessage("Failed to save! Couldn't upload feature image");
          setSnackbarOpen(true);
        });
    } else if (!rmOrigFeatureImage && !uploadedNew && postData) {
      featureImageURL = postData.featureImgUrl;
    }

    // tags formatting

    let tags = split(formRef.current.values.tags, "\\\\");

    if (tags[0] === "") {
      tags = [];
    }

    const body = postData
      ? localStorage.getItem("bearpost.savedUpdate")
      : localStorage.getItem("bearpost.saved");

    const params = {
      title: formRef.current.values.title,
      subtitle: formRef.current.values.subtitle,
      body: body,
      tags: tags,
      hidden: isDraft,
      featureImgUrl: featureImageURL,
    };

    const reqSlug = postData ? "/" + postData.id : "";

    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/posts" + reqSlug, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
      },
      method: postData ? "PUT" : "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (json.success) {
          setIsError(false);
          if (postData) {
            if (isDraft) {
              setMessage("Saved successfully!");
            } else {
              setMessage("Published successfully!");
            }
            localStorage.setItem("bearpost.savePath", "");
            setSnackbarOpen(true);
          } else {
            setMessage("Created successfully! Redirecting in 2 seconds...");
            setSnackbarOpen(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            Router.push("/auth/portal/dashboard/post/" + json.data.slug);
          }
        } else {
          setIsError(true);
          setMessage(json.message);
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        setIsError(true);
        if (postData) {
          setMessage("Failed to save!");
        } else {
          setMessage("Failed to create new post!");
        }
        setSnackbarOpen(true);
        console.log(error);
      });
  };

  const doDelete = async () => {
    await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/v1/posts/delete/" + postData.id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
        },
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then(async (json) => {
        if (json.success) {
          setIsError(false);
          setMessage("Deleted successfully! Redirecting to dashboard...");
          setSnackbarOpen(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          Router.push("/auth/portal/dashboard");
        } else {
          setIsError(true);
          setMessage(json.message);
          setSnackbarOpen(true);
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage("Failed to delete post!");
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          title: postData ? postData.title : "",
          subtitle: postData ? postData.subtitle : "",
          tags: postData ? join(postData.tags, "\\\\") : "",
          featureImage: "",
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required("Required"),
          subtitle: Yup.string().required("Required"),
        })}
        onSubmit={async () => {
          // Wait for 500ms so editor can save changes in localStorage
          await new Promise((r) => setTimeout(r, 500));
          await doSave();
        }}
      >
        {({ values, submitForm, isSubmitting, setFieldValue }) => (
          <StyledForm>
            <EditorButtonGroupWrapper>
              {postData && (
                <EditorButtonOutlined
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  type="danger"
                  onClick={() => {
                    setShowDialog(true);
                  }}
                  disabled={isSubmitting || disableButtons}
                >
                  Delete
                </EditorButtonOutlined>
              )}
              <EditorButton
                variant="contained"
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={() => {
                  setIsDraft(true);
                  submitForm();
                }}
                type="submit"
                disabled={isSubmitting || disableButtons}
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
                disabled={isSubmitting || disableButtons}
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
                  style={{ marginBottom: "10px" }}
                />
                <Field
                  component={TextField}
                  name="subtitle"
                  type="subtitle"
                  label="Subtitle"
                  style={{ marginBottom: "10px" }}
                />
                <Field
                  component={TextField}
                  name="tags"
                  type="tags"
                  label="Tags (seperated by \\)"
                  style={{ marginBottom: "10px" }}
                />
                <input
                  name="featureImage"
                  onChange={(event) => {
                    setFieldValue("featureImage", event.currentTarget.files[0]);
                    if (event.currentTarget.files[0]) {
                      setUploadedNew(true);
                      setRmOrigFeatureImage(true);
                    }
                  }}
                  accept="image/png,image/jpg,image/gif"
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                />
                <ImageInputWrapper>
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Upload
                    </Button>
                  </label>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={() => {
                      setUploadedNew(false);
                      setRmOrigFeatureImage(true);
                      setFieldValue("featureImage", "");
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {postData && rmOrigFeatureImage && (
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      onClick={() => {
                        setUploadedNew(false);
                        setRmOrigFeatureImage(false);
                        setFieldValue("featureImage", "");
                      }}
                    >
                      Restore Original
                    </Button>
                  )}
                </ImageInputWrapper>
                <ImagePreview file={values.featureImage} />
                {postData && !rmOrigFeatureImage && !uploadedNew && (
                  <StyledImageWrapper>
                    <StyledImage
                      src={
                        process.env.NEXT_PUBLIC_API_URL + postData.featureImgUrl
                      }
                    />
                  </StyledImageWrapper>
                )}
              </FieldWrapper>
              {isSubmitting && <LinearProgress />}
            </WidthWrapper>
          </StyledForm>
        )}
      </Formik>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={isError ? "error" : "success"}
        >
          {message}
        </Alert>
      </Snackbar>
      {postData && (
        <Dialog
          open={showDialog}
          onClose={() => {
            setShowDialog(false);
          }}
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`
              Are you sure you want to delete the post "${postData.title}"? This
              cannot be undone!
              `}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowDialog(false);
              }}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                doDelete();
                setShowDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default MetaForm;
