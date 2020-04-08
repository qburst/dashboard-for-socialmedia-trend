import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import LeftNav from '../LeftNav/LeftNav';
import Main from '../Main/Main';
import { connect } from 'react-redux';
import { FETCH_OVERALL_DATA, SIDEBAR_TOGGLE, ON_LOGOUT } from '../../Actions/Actions'
import './Dashboard.css';
import MyVerticallyCenteredModal from '../Popup/Popup';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';

class Dashboard extends Component {
    constructor(props) {
        super();
        this.state = {
            showAboutModal:false,
            showContactModal: false,
            isLoggedIn: sessionStorage.getItem('isLoggedIn')
        }
        this.onLogout = this.onLogout.bind(this);
        this.showAbout = this.showAbout.bind(this);
        this.showContact = this.showContact.bind(this);
    }

    componentDidMount() {
        // if (sessionStorage.getItem('Token')) {
        //     this.props.history.push('/dashboard')
        // }
        // else if (){
        // }
        // else {
        //     this.props.history.push('/')
        // }
        this.props.getData();
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, document.title, window.location.href);
        });
    }
    onLogout = () => {
        this.props.logout(this.props.history);
        this.setState({isLoggedIn: false});
    }

    showLogin=()=>{
        this.props.history.push('/login');
    }

    showAbout (){
        this.setState({showAboutModal: !this.state.showAboutModal});
    }

    showContact (){
        this.setState({showContactModal: !this.state.showContactModal});
    }

    setIsLoggedIn=()=>{
		this.setState({
			isLoggedIn:sessionStorage.getItem('isLoggedIn')
		})
	}

    render() {
        return (
            <div className='Dashboard'>
                <div className='wrapper'>
                    <LeftNav
                        toggleSideBar={this.props.reducer.toggleSideBar}
                        toggleSideBarFunc={this.props.toggleSideBar}
                        onLogout={this.onLogout}
                        showAbout={this.showAbout}
                        isLoggedIn = { this.state.isLoggedIn }
                        showContact = {this.showContact}
                    />
                    <Main
                        overAllData={this.props.reducer.overAllData}
                        toggleSideBar={this.props.toggleSideBar}
                        onLogout={this.onLogout}
                        spinner={this.props.reducer.spinner}
                        createdDate={this.props.reducer.createdDate}
                        showLogin = { this.showLogin }
                        setIsLoggedIn = {this.setIsLoggedIn}
                    />
                    <MyVerticallyCenteredModal
                        show={this.state.showAboutModal}
                        onHide={() => this.setState({showAboutModal: false})}
                        header="About"
                        bodyHeader="COVID-19 Twitter Data"
                        body={<div>We analyze social media data, then categorize and display in web platform for people fighting
                            corona. Currently our platform process twitter data and aggregate that to several categories and using a
                             web platform to show data to the entire world.This was done as an open source project by QBurst. You can provide your contributions 
                             <a href="https://github.com/qburst/dashboard-for-socialmedia-trend.git"> here</a>.</div>}
                    />
                    <MyVerticallyCenteredModal
                        show={this.state.showContactModal}
                        onHide={() => this.setState({showContactModal: false})}
                        header="Contact Us"
                        bodyHeader="We are open for your feedback"
                        body={  <div>  <a href="https://api.whatsapp.com/send?phone=919746785785" target="_blank" class="btn btn-success"><i class="fa fa-whatsapp"></i> WhatsApp</a>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=jinoj@qburst.com" target="_blank" class="btn btn-dark"><i class="fa fa-envelope" aria-hidden="true"></i> Mail Us</a></div> }
                    />
                </div>
                <NotificationContainer/>
                <Footer />
            </div>
        )
    }
}

export const mapStateToProps = (state) => {
    return {
        reducer: state
    }
}


export const mapDispatchToProps = (dispatch) => {
    return {
        getData: () => {
            dispatch({ type: FETCH_OVERALL_DATA })
        },
        logout: (history) => {
            dispatch({ type: ON_LOGOUT, history: history })
        },
        toggleSideBar: () => {
            dispatch({ type: SIDEBAR_TOGGLE })
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);