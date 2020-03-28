import React, { Component } from 'react'
import './LandingPage.css'
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import { connect } from 'react-redux';
import { SEND_REGISTRATION_DATA, DISPLAY_LOGIN_PAGE,DISPLAY_SIGNIN_PAGE, 
    SET_USERNAME, SET_PASSWORD, ON_USER_LOGIN  } from '../../Actions/Actions'

class LandingPage extends Component {
    constructor(props){
        super()
    }

    componentDidMount(){
        if(sessionStorage.getItem('Token')){
            sessionStorage.removeItem('Token');
        }
    }

    displayLogin=()=>{
        this.props.displayLoginPage();
    }

    displaySignup=()=>{
        this.props.displaySignupPage();
    }

    render() {
        const { reducer } = this.props;
        return (
            <div className="landingpage">
            <div class="LandingPage_header">
						<h1 class="header-title">
							COVID-19 Twitter Data
						</h1>
					</div>
                
                {
                    reducer.showLogin &&
                    <Login
                        history = { this.props.history}
                        loginFailure = { reducer.loginFailure }
                        errorMessageLogin = { reducer.errorMessageLogin }
                        userName = { reducer.userName }
                        password = { reducer.password }
                        setUsername = { this.props.setUsername }
                        setPassword = { this.props.setPassword }
                        onUserLogin = { this.props.onUserLogin }
                        spinner = { reducer.spinner }
                        displaySignup = { this.displaySignup }
                    />
                }
                {
                    reducer.showSignup &&
                    <Signup
                        registrationSuccess = { reducer.registrationSuccess }
                        submitSignupDetails = { this.props.submitSignupDetails}
                        errorMessageRegistration = { reducer.errorMessageRegistration }
                        registrationFailure = { reducer.registrationFailure }
                        displayLogin =  { this.displayLogin }
                        spinner = { reducer.spinner }
                    />
                }
            </div>
        )
    }
}

export const mapStateToProps = (state)=>{
    return{
        reducer:state
    }
}


export const mapDispatchToProps = (dispatch)=>{
    return{
        submitSignupDetails:( userName, emailId, password )=>{
            dispatch({type:SEND_REGISTRATION_DATA, data:{userName, emailId, password}})
        },
        displayLoginPage:()=>{
            dispatch({type:DISPLAY_LOGIN_PAGE})
        },
        displaySignupPage:()=>{
            dispatch({type:DISPLAY_SIGNIN_PAGE})
        },
        setUsername:(username)=>{
            dispatch({type:SET_USERNAME, data:username})
        },
        setPassword:(password)=>{
            dispatch({type:SET_PASSWORD, data:password})
        },
        onUserLogin:(userName, password, history)=>{
            dispatch({type:ON_USER_LOGIN, userName, password, history})
        }
    }
        
}

export default connect( mapStateToProps, mapDispatchToProps )(LandingPage);
