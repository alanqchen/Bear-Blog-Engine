import { connect } from "react-redux";
import { refresh } from "../../redux/auth/actions";
import { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { debounce, throttle } from "lodash";
import { StyledEditor } from "./EditorStyled";
import EditorTheme from "../Theme/editorTheme";
import { EmbedsArray } from "./Embeds";

function Editor({
  dispatch,
  defaultValue,
  isPreview,
  isNew,
  savePath,
  useRestore,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Force remounting of component (for restoring unsaved changes)
  const [restoreVal, setRestoreVal] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  // SNACKBAR
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (initialLoad) {
      if (isNew) {
        localStorage.setItem("bearpost.saved", defaultValue);
      } else {
        localStorage.setItem("bearpost.savedUpdate", defaultValue);
      }
      setInitialLoad(false);
    }
    if (useRestore) {
      const restore = localStorage.getItem("bearpost.savedRestore");
      setRestoreVal(restore);
      if (isNew) {
        localStorage.setItem("bearpost.saved", restore);
      } else {
        localStorage.setItem("bearpost.savedUpdate", restore);
      }
    }
  }, [initialLoad, useRestore]);

  // Refresh tokens every 5 mins (300000 ms)
  const handleAuthRefresh = throttle(
    () => {
      console.log("Refreshing tokens");
      dispatch(refresh());
    },
    300000,
    {
      leading: false,
      trailing: true,
    }
  );

  const handleUpdate = debounce((value) => {
    console.log("Storing unsaved changes...");
    const text = value();
    if (isNew) {
      localStorage.setItem("bearpost.saved", text);
    } else {
      localStorage.setItem("bearpost.savedUpdate", text);
      if (savePath) {
        localStorage.setItem("bearpost.savedRestore", text);
        localStorage.setItem("bearpost.savePath", savePath);
      }
    }
  }, 400);

  const handleChange = (value) => {
    handleUpdate(value);
    handleAuthRefresh();
  };

  return (
    <>
      <StyledEditor
        theme={EditorTheme}
        onClickHashtag={(tag) => {
          history.push(`/category/${tag}`);
        }}
        onShowToast={(message, id) => {
          setErrorMsg(message + " (" + id + ")");
          setSnackbarOpen(true);
        }}
        readOnly={isPreview}
        defaultValue={defaultValue}
        value={restoreVal ? restoreVal : undefined}
        onChange={handleChange}
        embeds={EmbedsArray}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default connect()(Editor);
