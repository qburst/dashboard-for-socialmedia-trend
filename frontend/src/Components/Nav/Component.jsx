import React from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import Link from "@material-ui/core/Link";
import { Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import {
  getShowSignInModal,
  getShowSignUpModal,
  logout,
} from "../../slice/sessionSlice";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 300,
  },
  avatar: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  user: {
    width: "100%",
    height: theme.spacing(30),
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginTop: theme.spacing(2)
  }
}));

const propTypes = {
  open: PropTypes.bool.isRequired,
  onToggleDrawer: PropTypes.func.isRequired,
};
const Nav = ({ open, onToggleDrawer }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { isSignedIn, name } = useSelector((state) => state.session);

  const drawer = (
    <div
      role="presentation"
      onClick={onToggleDrawer(false)}
      onKeyDown={onToggleDrawer(false)}
    >
      <div className={classes.user}>
        <Avatar className={classes.avatar}>
          {isSignedIn ? name[0].toUpperCase() : "U"}
        </Avatar>
        {isSignedIn ? <Typography variant="body1" className={classes.name}>{name}</Typography> : null}
      </div>
      <Divider />
      <List>
        {!isSignedIn ? (
          <>
            <ListItem
              button
              onClick={() => {
                dispatch(getShowSignUpModal());
              }}
            >
              <ListItemIcon>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                dispatch(getShowSignInModal());
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Sign in" />
            </ListItem>
          </>
        ) : (
          <ListItem
            button
            onClick={() => {
              dispatch(logout());
            }}
          >
            <ListItemIcon>
              <CallMadeIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <Link href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019" rel="noopener noreferrer" target="_blank">
          <ListItem button>
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <ListItemText primary="WHO COVID-19" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onToggleDrawer(false)}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true,
      }}
      aria-label="site main navigation"
    >
      {drawer}
    </Drawer>
  );
};

Nav.propTypes = propTypes;
export default Nav;
