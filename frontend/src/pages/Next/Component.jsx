import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import Header from "../../Components/Header";
import Nav from "./components/Nav";
import Masthead from "../../Components/Masthead";
import Tweets from "../../Components/Tweets";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
  tweetsContainer: {
    marginTop: "-180px",
    position: "relative",
  },
  scrollToTop: {
    position: 'fixed',
    right: theme.spacing(5),
    bottom: theme.spacing(5),
    zIndex: theme.zIndex['2']
  }
}));

export const Next = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onScrollTop = () => {
    window.scroll({
      top: 0, 
      behavior: 'smooth'
    });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header onClick={handleDrawerToggle} />
      {/* <Nav open={mobileOpen} onClose={handleDrawerToggle} /> */}
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
    </div>
  );
};

export default Next;
