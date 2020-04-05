import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import {
  FETCH_OVERALL_DATA,
  SIDEBAR_TOGGLE,
  ON_LOGOUT
} from "../../Actions/Actions";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Masthead from "./components/Masthead";
import Tweets from "./components/Tweets";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3)
  },
  tweetsContainer: {
    marginTop: '-180px',
    position: 'relative',
  }
}));

export const Next = ({ getData, container, reducer }) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
console.log(reducer.overAllData);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header onClick={handleDrawerToggle} />
      {/* <Nav open={mobileOpen} onClose={handleDrawerToggle} /> */}
      <main className={classes.content}>
        <Masthead data={reducer.overAllData} date={reducer.createdDate} />
        <Container maxWidth="lg" className={classes.tweetsContainer}>
          <Tweets data={reducer.overAllData} />
        </Container>
      </main>
    </div>
  );
};

export const mapStateToProps = state => {
  return {
    reducer: state
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    getData: () => {
      dispatch({ type: FETCH_OVERALL_DATA });
    },
    logout: history => {
      dispatch({ type: ON_LOGOUT, history: history });
    },
    toggleSideBar: () => {
      dispatch({ type: SIDEBAR_TOGGLE });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Next);
