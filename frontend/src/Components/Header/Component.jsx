import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    fontSize: '1.5rem',
    letterSpacing: '-1px',
  }
}));

const propTypes = {
  onClick: PropTypes.func.isRequired,
};
const Header = ({ onClick }) => {
  const classes = useStyles();

  return (
    <header className={`${classes.header} ${classes.toolbar}`}>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h6" noWrap className={classes.logo}>
          COVID-19 Feed
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onClick}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Container>
    </header>
  );
};

Header.propTypes = propTypes;
export default Header;
