import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";

import { getHideLoginModal } from "../../slice/sessionSlice";
import { getReportTweetRemove } from "../../slice/tweetsSlice";

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialog-paper": {
      alignItems: "center",
    },
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(10),
      marginRight: theme.spacing(10),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  message: {
    textAlign: "center",
  },
  textfield: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const SigninSignupDialog = () => {
  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const dispatch = useDispatch();
  const { showLoginModal } = useSelector((state) => state.session);
  const { chosenTweet } = useSelector((state) => state.tweets);

  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const onHide = () => {
    dispatch(getHideLoginModal());
    dispatch(getReportTweetRemove());
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!name) {
      errors.name = "Please provide your name";
    }

    if (!email) {
      errors.email = "Please provide your email id";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please provide a valid email id";
    }

    if (!password) {
      errors.password = "Please provide your password";
    } else if (showSignup && !PASSWORD_REGEX.test(password)) {
      errors.password =
        "Please choose a stronger password. At least 8 characters, uppercase and lowercase letters, numbers and symbols";
    }

    if (showSignup && password && password !== confirmPassword) {
      errors.confirmPassword = "Please make sure the passwords match";
    }

    setErrors(errors);

    if (Object.keys(errors).length) {
      alert("fix errors");
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={showLoginModal}
      TransitionComponent={Transition}
      onClose={onHide}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      className={classes.root}
    >
      <DialogTitle id="dialog-title">
        {showSignup ? "Sign up" : "Sign in"}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onHide}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {chosenTweet ? (
            <Typography className={classes.message}>
              You need to sign in order to report a tweet
            </Typography>
          ) : null}
        </DialogContentText>
        <form onSubmit={onSubmit} className={classes.content}>
          {showSignup ? (
            <TextField
              autoFocus
              id="outlined-basic"
              variant="outlined"
              label="Name"
              name="name"
              value={name}
              onChange={onChange}
              className={classes.textfield}
              error={errors.name}
              helperText={errors.name}
            />
          ) : null}
          <TextField
            autoFocus
            id="outlined-basic"
            variant="outlined"
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={onChange}
            className={classes.textfield}
            error={errors.email}
            helperText={errors.email}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={onChange}
            className={classes.textfield}
            error={errors.password}
            helperText={errors.password}
          />
          {showSignup ? (
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="password"
              label="Confirm password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className={classes.textfield}
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          ) : null}
          <div className={classes.formActions}>
            {showSignup ? (
              <Button
                onClick={() => {
                  setShowSignup(false);
                  setErrors({});
                }}
                color="primary"
                className={classes.switch}
                type="button"
              >
                Sign in instead
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setShowSignup(true);
                  setErrors({});
                }}
                color="primary"
                className={classes.switch}
                type="button"
              >
                Create account
              </Button>
            )}
            {showSignup ? (
              <Button
                disableElevation
                variant="contained"
                color="primary"
                className={classes.switch1}
                type="submit"
              >
                Sign up
              </Button>
            ) : (
              <Button
                disableElevation
                variant="contained"
                color="primary"
                className={classes.switch1}
                type="submit"
              >
                Sign in
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SigninSignupDialog;
