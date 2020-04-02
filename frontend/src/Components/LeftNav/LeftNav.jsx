import React, { Component } from 'react';
import './LeftNav.css';
import { connect } from 'react-redux';
import {FETCH_TWEET_DATA, FETCH_TWEET_DATA_CATEGORY_WISE, SET_CATEGORY, FETCH_CATEGORIES, ON_LOGOUT} from '../../Actions/Actions';


class Sidebar extends Component {

  constructor(props) {
    super(props)
    this.props.getCategories()
  };

  toggleSideBar=()=>{
    this.props.toggleSideBarFunc();
  }

  fetchTweetsCategoryWise(item) {
    this.props.setCategory(item);
    if(item){
      this.props.fetchTweetsCategoryWise(item,1);
    } else{
      this.props.fetchTweets(1);
    }
    if(this.props.toggleSideBar){
      this.toggleSideBar();
    }
  }

  showAbout = () => {
    this.props.showAbout();
    if(this.props.toggleSideBar){
      this.toggleSideBar();
    }
  }
  
  showContact = ()=>{
    this.props.showContact();
  }

  render() {
    return (
      <nav id="main_sidebar" className={"main_sidebar " + (this.props.toggleSideBar ? 'toggled' : '')}>
        <div className="sidebar-brand">
        <img
            className="user-avatar rounded-circle mr-2"
            src={require("../../Images/avatar.png")}
            alt="User Avatar"
          />
          <span className="text-white">{sessionStorage.getItem("Username")}</span>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-user" onClick={()=>{this.showAbout()}}>
            <div className="font-weight-bold about">About</div>
          </div>
          <div className="sidebar-user" onClick={()=>{this.showContact()}}>
            <div className="font-weight-bold contact">Contact Us</div>
          </div>
          <div className="sidebar-user" onClick={ ()=> this.fetchTweetsCategoryWise()}>
            <div className="font-weight-bold dashboard">Dashboard</div>
          </div>
          <ul className="sidebar-nav">
            {this.props.items && this.props.items.map((item, idx) => (
            <li className={"sidebar-item "  + (this.props.category === item._id ? 'active' : '')} key={idx}  onClick={ ()=> this.fetchTweetsCategoryWise(item._id) }>
              <a href="#dashboards" data-toggle="collapse" className="sidebar-link" aria-expanded="true">
                 <span className="align-middle">{item._id.replace(/_/g, " ")}</span>
              </a>
            </li>))}
            <li className="sidebar-item"><a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports" target="_blank" className="links">WHO</a></li>
            <li className="sidebar-item"><a href="https://www.mygov.in/covid-19/" target="_blank" className="links">COVID-19 India</a></li>
            <li className="sidebar-item"><a href="https://ourworldindata.org/coronavirus-source-data" target="_blank" className="links">ECDC</a></li>
            <li className="sidebar-item"><a href="https://www.covidvisualizer.com/" target="_blank" className="links">COVID Visualizer</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export const mapStateToProps = (state) => {
  return {
    category: state.category,
    items: state.navItems
  }
}


export const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: () => {
      dispatch({ type: FETCH_CATEGORIES })
    },
    fetchTweetsCategoryWise: (category,page) => {
      dispatch({
        type: FETCH_TWEET_DATA_CATEGORY_WISE,
        category,
        page
      })
    },
    fetchTweets: (page) => {
      dispatch({
        type: FETCH_TWEET_DATA,
        page
      })
    },
    setCategory: (category)=>{
      dispatch({
        type: SET_CATEGORY,
        category
      })
    },
  }

}

export default connect( mapStateToProps, mapDispatchToProps )(Sidebar);