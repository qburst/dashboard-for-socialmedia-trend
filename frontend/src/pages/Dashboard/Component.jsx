import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";

import { hideToaster } from "../../slice/toasterSlice";
import Header from "../../Components/Header";
import Nav from "../../Components/Nav";
import Masthead from "../../Components/Masthead";
import Tweets from "../../Components/Tweets";
import SigninSignupDialog from "../../Components/SigninSignupDialog";
import Footer from '../../Components/Footer';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
  tweetsContainer: {
    marginTop: "-180px",
    position: "relative",
  },
  scrollToTop: {
    position: "fixed",
    right: theme.spacing(5),
    bottom: theme.spacing(5),
    zIndex: theme.zIndex["2"],
  },
}));

export const Dashboard = () => {
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = useState(false);

  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.toaster);

  const onToggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setShowDrawer(open);
  };

  const onScrollTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const onToasterClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(hideToaster());
  };

  return (
    <div>
      <CssBaseline />
      <Header onToggleDrawer={onToggleDrawer} />
      <Nav open={showDrawer} onToggleDrawer={onToggleDrawer} />
      <main className={classes.content}>
        <Masthead />
        <Container maxWidth="lg" className={classes.tweetsContainer}>
          <Tweets />
          <Fab
            size="small"
            color="default"
            aria-label="scroll to top"
            className={classes.scrollToTop}
            onClick={onScrollTop}
          >
            <ExpandLessIcon />
          </Fab>
        </Container>
      </main>
      <Footer />

      <SigninSignupDialog />

      <Snackbar
      key={message || undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={Boolean(message.length)}
        autoHideDuration={3400}
        onClose={onToasterClose}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onToasterClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default Dashboard;
