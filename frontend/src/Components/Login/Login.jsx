import React, { Component } from 'react';
import './Login.css';


class Login extends Component {
    constructor(props){
        super()
        this.state={
            errors:{}
        }
    }

    onChangeUsername=(e)=>{
        let username = e.target.value
        this.props.setUsername(username);
    }
        
    onChangePassword=(e)=>{
        let password = e.target.value
        this.props.setPassword(password);
    }

    onLogin=()=>{
        let userName = this.props.userName;
        let password = this.props.password;
        let history = this.props.history
        
        let errors = {};
        let formIsValid = true;

        if(!userName){
            formIsValid = false
            errors['userName'] = 'UserName Cannot be empty';
        }

        if(!password){
            formIsValid = false
            errors['password'] = 'Password Cannot be empty';
        }

        this.setState({
            errors:errors
        })

        formIsValid && this.props.onUserLogin(userName, password, history);
    }


    render() {
        let className;
        if(this.props.loginFailure || this.state.errors["userName","password"]){
            this.className = 'failure'
        }
        return (
            <div class={`login ${this.className} `} >
                <div className="login_wrapper">
                <div class="header_login">
                    Login
                </div>
                { this.props.loginFailure &&  
                    <div className='loginFailure'> Login Failed
                        <p>{this.props.errorMessageLogin}</p>
                    </div>
                }
                <div class="Container_input">
                    <div class="input_username">
                        <input type="text" class="name" onChange={ this.onChangeUsername } placeholder="Email Id"/>
                        <p className='inputError'>{this.state.errors["userName"]}</p>
                    </div>
                    <div class="input_password">
                        <input type="password" class="password" onChange={ this.onChangePassword } placeholder="Password"/>
                        <p className='inputError' >{this.state.errors["password"]}</p>
                    </div>
                </div>
                    <button type="submit" onClick={ this.onLogin } disabled={ this.props.spinner } class="btn btn-Default submit_login">{this.props.spinner ? 'Logging In...' : 'Login' }</button>
                    <button class="btn btn-Default login_page_signup-btn" onClick={ this.props.displaySignup } >Create Account</button>

               </div>
               </div>
        )
    }
}

export default Login;
