import Router from "next/router";
import { useEffect, useState } from "react";
import { WidthWrapper } from "../DashboardLayout/dashboardLayoutStyled";
import { Divider, Snackbar, LinearProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Visibility as VisibilityIcon } from "@material-ui/icons";
import Editor from "./Editor";
import MetaForm from "./MetaForm";
import { StyledFab } from "./EditorStyled";

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
          <StyledFab
            aria-label="preview"
            onClick={() => {
              setIsPreview(!isPreview);
            }}
            style={{ zIndex: "999999" }}
          >
            <VisibilityIcon color="action" />
          </StyledFab>
          <MetaForm postData={postData} />
          <WidthWrapper>
            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
            <Editor defaultValue={postData.body} isPreview={isPreview} />
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
