import React, { Component } from 'react'
import './Header.css';

export default class Header extends Component {

  logout=()=>{
    this.props.onLogout();
  }

    render() {
        return (
          <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
              {/* Left navbar links */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" data-widget="pushmenu" href="fakeURL"><i className="fas fa-bars" /></a>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                  <a href="index3.html" className="nav-link">Dashboard</a>
                </li>
              </ul>
              {/* SEARCH FORM */}
              {/* <form className="form-inline ml-3">
                <div className="input-group input-group-sm">
                  <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                  </div>
                </div>
              </form> */}
              <button className="logout" type="submit" disabled={ this.props.spinner } onClick={this.logout} style={{ marginLeft: '72%'}}>
              {/* {this.props.spinner ? 'Logging Out...' : 'Logout' } */} Logout
              </button>
              {/* Right navbar links */}
            </nav>
          </div>
        )
    }
}

