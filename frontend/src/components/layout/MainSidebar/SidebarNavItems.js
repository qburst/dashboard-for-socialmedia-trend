import React from "react";
import { Nav } from "shards-react";

import SidebarNavItem from "./SidebarNavItem";
import {FETCH_CATEGORIES} from "../../../Actions/Actions";
import { connect } from 'react-redux';

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)
    this.props.getCategories()
  };
  render() {
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {this.props.items && this.props.items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item._id} />
          ))}
        </Nav>
      </div>
    )
  }
}
  



export const mapStateToProps = (state) => {
  console.log(state.navItems, 'navItems')
  return {
    items: state.navItems
  }
}
export const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: () => {
      console.log('dis')
      dispatch({ type: FETCH_CATEGORIES })
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavItems);
