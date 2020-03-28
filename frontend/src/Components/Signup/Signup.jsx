import React, { Component } from 'react'
import './Signup.css'
export default class Signup extends Component {
    constructor(props){
        super()
        this.state={
            userName:'',
            emailId:'',
            password:'',
            errors: {}
        }
    }

    getUserName=(e)=>{
        this.setState({
            userName:e.target.value
        })
    }

    getEmail=(e)=>{
        this.setState({
            emailId:e.target.value
        })
    }

    getPassword=(e)=>{
        this.setState({
            password:e.target.value
        })
    }

    submitSignupDetails=(e)=>{
        var userName = this.state.userName
        var emailId = this.state.emailId
        var password = this.state.password
        
        let errors = {};
        let formIsValid = true;

        if(!userName){
            formIsValid = false;
            errors["userName"] = "UserName Cannot be empty";
         }
        if(!emailId){
            formIsValid = false;
            errors["emailId"] = "EmailId Cannot be empty";
         }
         if(!password){
            formIsValid = false;
            errors["password"] = "Password Cannot be empty";
         }

        this.setState({
            errors : errors
        })
        
         formIsValid && ( this.props.submitSignupDetails( userName, emailId, password ) )
    }

    render() {
        let className;
        if(this.props.registrationFailure || this.state.errors["userName","emailId","password"]){
            this.className = 'failure'
        }
        else if( this.props.registrationSuccess ){
            this.className = 'success'
        }
        return (
            <div className={`signup ${this.className} `}>
            <div className="login_wrapper">
                <div className="header_signup">
                Create Account
                </div>
                {
                    this.props.registrationSuccess && ! this.props.registrationFailure && 
                    <div className='signupSuccess'> Registration Successful!!
                        <p>Click here to <a style= {{ textDecoration: 'underline'}}onClick={ this.props.displayLogin }> Login</a></p>
                    </div>
                }
                {
                    this.props.registrationFailure &&
                    <div className='signupFailure'> Sign up Failed!!
                        <p>{this.props.errorMessageRegistration}</p>
                    </div>
                }
                <div className='Container_input'>
                    <div className="input_username">
                        <input type="text" className="name" onChange={ this.getUserName } placeholder="Name" />
                        <p className='inputError'>{this.state.errors["userName"]}</p>
                    </div>
                    <div className="input_email">
                        <input type="email" className="email" onChange={ this.getEmail } placeholder="Email Id" />
                        <p className='inputError'>{this.state.errors["emailId"]}</p>
                    </div>
                    <div className="input_password">
                        <input type="password" className="password" onChange={ this.getPassword } placeholder="Password" />
                        <p className='inputError'>{this.state.errors["password"]}</p>

                    </div>
                </div>
                    <button type="submit" className=" btn btn-Default submit_signup" disabled={ this.props.spinner } onClick={ this.submitSignupDetails } >{this.props.spinner ? 'Signing Up...' : 'Sign Up' }</button>
                    <button class="btn btn-Default signup_page_login-btn" onClick={ this.props.displayLogin } >Back To Login</button>

             </div>
             </div>
        );
    }
}
