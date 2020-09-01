import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Add as AddIcon } from "@material-ui/icons";
import {
  EditorsTableRow,
  EditorsTableContainer,
  EditorsTableHead,
} from "./editorsTableStyled";
import { EditorButtonGroupWrapper, EditorButton } from "../Editor/EditorStyled";
import { timestamp2date } from "../utils/helpers";

function EditorsTable({ auth }) {
  // SNACKBAR
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const [loaded, setLoaded] = useState(false);
  const [editors, setEditors] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userEdit, setUserEdit] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // "Cancel" promise if component is not mounted
    let isSubscribed = true;

    const getUsers = async () => {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/users/detailed", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && isSubscribed) {
            setEditors(json.data);
            setLoaded(true);
          } else if (isSubscribed) {
            setIsError(true);
            setMessage(json.message);
            setSnackbarOpen(true);
          }
        })
        .catch(() => {
          if (isSubscribed) {
            setIsError(true);
            setMessage("Failed to get editors!");
            setSnackbarOpen(true);
          }
        });
    };

    getUsers();

    return () => (isSubscribed = false);
  }, [refresh]);

  const editUser = async (name, username, password, admin) => {
    const params = {
      name: name,
      username: username,
      password: password,
      admin: admin,
    };

    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
      },
      method: userEdit ? "PUT" : "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setIsError(false);
          setMessage("Created editor!");
          setSnackbarOpen(true);
          setShowDialog(false);
          setRefresh(!refresh);
        } else {
          setIsError(true);
          setMessage(json.message);
          setSnackbarOpen(true);
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage("Failed to create/update editor!");
        setSnackbarOpen(true);
      });
  };

  const deleteUser = async (id) => {
    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/users/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("bearpost.JWT"),
      },
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setIsError(false);
          setMessage("Deleted editor!");
          setSnackbarOpen(true);
        } else {
          setIsError(true);
          setMessage(json.message);
          setSnackbarOpen(true);
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage("Failed to delete editor!");
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      {auth.userData && auth.userData.admin && (
        <EditorButtonGroupWrapper noBottomMargin>
          <EditorButton
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => {
              setUserEdit(null);
              setShowDialog(true);
            }}
            type="publish"
          >
            New User
          </EditorButton>
        </EditorButtonGroupWrapper>
      )}
      <EditorsTableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table aria-label="editors table">
          <EditorsTableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </EditorsTableHead>
          <TableBody>
            {loaded &&
              auth.userData &&
              editors.map((user, i) => (
                <EditorsTableRow
                  hover={auth.userData.admin}
                  key={i}
                  pointer={auth.userData.admin ? "1" : undefined}
                  onClick={() => {
                    if (auth.userData.admin) {
                      setUserEdit(user);
                      setShowDialog(true);
                    }
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{timestamp2date(user.createdAt)}</TableCell>
                  <TableCell>{user.admin ? "Admin" : "Editor"}</TableCell>
                </EditorsTableRow>
              ))}
          </TableBody>
        </Table>
      </EditorsTableContainer>
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

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="form-dialog-title">
          {userEdit ? "Edit Editor" : "Create New Editor"}
        </DialogTitle>
        <Formik
          initialValues={{
            name: userEdit ? userEdit.name : "",
            username: "",
            password: "",
            passwordConfirm: "",
            admin: userEdit ? userEdit.admin : false,
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
            if (!userEdit) {
              console.log("Calling edit user");
              await editUser(
                values.name,
                values.username,
                values.password,
                values.admin
              );
            } else {
            }
            setSubmitting(false);
          }}
        >
          {({ values, submitForm, isSubmitting }) => (
            <Form>
              <DialogContent>
                {!userEdit && (
                  <DialogContentText id="alert-dialog-description">
                    The username cannot be changed once created.
                  </DialogContentText>
                )}
                <Field
                  component={TextField}
                  name="name"
                  type="name"
                  label="Name"
                  fullWidth
                />
                {!userEdit && (
                  <Field
                    component={TextField}
                    name="username"
                    type="username"
                    label="Username"
                    fullWidth
                  />
                )}
                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  label={userEdit ? "New Password" : "Password"}
                  fullWidth
                />
                <Field
                  component={TextField}
                  name="passwordConfirm"
                  type="password"
                  label={userEdit ? "Confirm New Password" : "Confirm Password"}
                  fullWidth
                />
                <Field
                  component={CheckboxWithLabel}
                  name="admin"
                  type="checkbox"
                  Label={{ label: "Admin" }}
                />
                {isSubmitting && <LinearProgress />}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowDialog(false);
                  }}
                  color="primary"
                  disabled={isSubmitting}
                  autoFocus
                >
                  Cancel
                </Button>
                {userEdit && (
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    submitForm();
                  }}
                >
                  {userEdit ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      {userEdit && (
        <Dialog
          open={showConfirm}
          onClose={() => {
            setShowConfirm(false);
          }}
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`
              Are you sure you want to delete the user "{userEdit.username}"?
              This cannot be undone!
              `}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowConfirm(false);
              }}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={async () => {
                await deleteUser(userEdit.id);
                setShowConfirm(false);
                setShowDialog(false);
                setRefresh(!refresh);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: {
      loading: state.auth.loading,
      userData: state.auth.userData,
    },
  };
};

export default connect(mapStateToProps)(EditorsTable);
