import Router from "next/router";
import { useEffect, useState } from "react";
import { WidthWrapper } from "../DashboardLayout/dashboardLayoutStyled";
import {
  Divider,
  Snackbar,
  LinearProgress,
  Grow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert, ToggleButton } from "@material-ui/lab";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import Editor from "./Editor";
import MetaForm from "./MetaForm";
import { StyledFab, ToggleButtonWrapper } from "./EditorStyled";

const EditorWrapper = ({ query }) => {
  // SNACKBAR
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowMessage(false);
  };

  const [loaded, setLoaded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [postData, setPostData] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [viewRaw, setViewRaw] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    // "Cancel" promise if component is not mounted
    let isSubscribed = true;

    async function fetchPost() {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/admin/${query.year}/${query.month}/${query.slug}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
          },
        }
      )
        .then((res) => res.json())
        .then(async (json) => {
          if (isSubscribed && json.success) {
            console.log("Post ID: " + json.data.id);
            setPostData(json.data);
            setEditorValue(json.data.body);
            setIsError(false);
            setMessage("Found post!");
            setShowMessage(true);
            setLoaded(true);
          } else if (isSubscribed) {
            setIsError(true);
            setMessage(json.message + " Returning to dashboard...");
            setShowMessage(true);
            await new Promise((r) => setTimeout(r, 2000));
            Router.push("/auth/portal/dashboard");
          }
        })
        .catch(async () => {
          if (isSubscribed) {
            setIsError(true);
            setMessage("Failed to get post. Returning to dashboard...");
            setShowMessage(true);
            await new Promise((r) => setTimeout(r, 2000));
            Router.push("/auth/portal/dashboard");
          }
        });
    }
    if (isInitialLoad) {
      fetchPost();
      setIsInitialLoad(false);
    }

    return () => (isSubscribed = false);
  }, []);

  return (
    <>
      {!loaded && <LinearProgress />}
      {loaded && (
        <>
          <Grow in={!viewRaw}>
            <StyledFab
              aria-label="preview"
              onClick={() => {
                setIsPreview(!isPreview);
              }}
              style={{ zIndex: "999999" }}
            >
              <Grow
                in={!isPreview}
                style={isPreview ? { display: "none" } : {}}
              >
                <VisibilityIcon color="action" />
              </Grow>
              <Grow in={isPreview}>
                <EditIcon
                  color="action"
                  style={!isPreview ? { display: "none" } : {}}
                />
              </Grow>
            </StyledFab>
          </Grow>
          <MetaForm postData={postData} disableButtons={viewRaw} />
          <WidthWrapper>
            <ToggleButtonWrapper>
              <ToggleButton
                value="check"
                selected={viewRaw}
                onChange={() => {
                  setViewRaw(!viewRaw);
                }}
              >
                Raw
              </ToggleButton>
              {viewRaw && (
                <Typography
                  color="textSecondary"
                  style={{ marginLeft: "10px" }}
                >
                  You must toggle off raw mode before saving to verify your
                  changes
                </Typography>
              )}
            </ToggleButtonWrapper>
            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
            {!viewRaw ? (
              <Editor
                defaultValue={editorValue}
                isPreview={isPreview}
                onChange={(value) => {
                  setEditorValue(value);
                }}
              />
            ) : (
              <TextField
                name="raw"
                fullWidth
                multiline
                value={editorValue}
                onChange={(event) => {
                  setEditorValue(event.target.value);
                }}
                variant="outlined"
              />
            )}
            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
          </WidthWrapper>
        </>
      )}
      <Snackbar
        open={showMessage}
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
    </>
  );
};

export default EditorWrapper;
