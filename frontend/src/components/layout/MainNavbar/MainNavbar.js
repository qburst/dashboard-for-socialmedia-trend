import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container className="p-10">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0 ">
        <NavbarToggle />
          <div className="fa-1x text-center page-header" style={{margin: '0',width: "50%",paddingTop: '1.3rem', border: '0'}} >
            <span className="page-title" style={{padding: '0 6%',fontSize: '1.5em'}}>COVID-19 TWITTER DATA</span>
            </div>
          <NavbarNav style={{position: 'absolute'}}/>
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
