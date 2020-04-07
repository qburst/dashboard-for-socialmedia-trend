import React from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 250,
  },
  avatar: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  user: {
    width: '100%',
    height: theme.spacing(30),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const propTypes = {
  open: PropTypes.bool.isRequired,
  onToggleDrawer: PropTypes.func.isRequired,
};
const Nav = ({ open, onToggleDrawer }) => {
  const classes = useStyles();

  const { isSignedIn, name } = useSelector((state) => state.session);

  const drawer = (
    <div
      role="presentation"
      onClick={onToggleDrawer(false)}
      onKeyDown={onToggleDrawer(false)}
    >
      <div className={classes.user}>
        <Avatar className={classes.avatar}>
          {isSignedIn ? name[0].toUppercase() : "U"}
        </Avatar>
        <span>{name}</span>
      </div>
      <Divider />
      <List>
        {["Sign in", "Sign up"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["WHO"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
