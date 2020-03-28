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
            modalShow: false
        }
        this.onLogout = this.onLogout.bind(this);
        this.showAbout = this.showAbout.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('Token')) {
            this.props.history.push('/dashboard')
        }
        else {
            this.props.history.push('/')
        }
        this.props.getData();
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, document.title, window.location.href);
        });
    }
    onLogout = () => {
        this.props.logout(this.props.history)
    }

    showAbout (){
        this.setState({modalShow: !this.state.modalShow});
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
                    />
                    <Main
                        overAllData={this.props.reducer.overAllData}
                        toggleSideBar={this.props.toggleSideBar}
                        onLogout={this.onLogout}
                        spinner={this.props.reducer.spinner}
                        createdDate={this.props.reducer.createdDate}
                    />
                    <MyVerticallyCenteredModal
                        show={this.state.modalShow}
                        onHide={() => this.setState({modalShow: false})}
                        header="About"
                        bodyHeader="COVID-19 Twitter Data"
                        body="We analyze social media data, then categorize and display in web platform for people fighting
                        corona. Currently our platform process twitter data and aggregate that to several categories and aggregate that to several categories and using a
                         web platform to show the data to the entire world."
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