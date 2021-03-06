/* eslint-disable react/prop-types */
/* eslint-disable complexity */
import React, { Component } from 'react';
import { Link } from '@reach/router';
import { makeAPICalls } from '../utils/apiCalls';
import  Alert from 'react-bootstrap/Alert';

function validate( username, password ) {
    return {
        username: username.length === 0,
        password: password.length === 0
    };
}

export default class Home extends Component {
    state = {
        showRegistration: false,
        userSignedIn: false,
        username: '',
        password: '',
        registerUsername: '',
        registerPassword: '',
        users: [],
        signInError: '',
        newUserError: ''
    };

    render() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        const errors1 = validate( this.state.registerUsername, this.state.registerPassword );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return (
            <div className="loginForm">
                {!this.state.userSignedIn && (
                    <form onSubmit={this.handleSubmit} className="container1">
                        <input
                            className="log-ins"
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                            required
                        />
                        <input
                            className="log-ins"
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            required
                        />
                        <button disabled={isDisabled}>Login</button>
                        <p className="register">
                            Haven't got an account? Register{' '}
                            <Link to={'/'} onClick={this.handleRegister}>
                                {' '}
                                here.
                            </Link>
                        </p>
                    </form>
                )}
                {this.state.signInError !== '' && (
                    <Alert className="alert1" variant="danger">
                        {this.state.signInError}
                    </Alert>
                )}
                {this.state.showRegistration && !this.state.userSignedIn && (
                    <form onSubmit={this.handleSubmit1} className="create-account-modal animate">
                        <input
                            className="log-ins"
                            type="text"
                            placeholder="Username"
                            value={this.state.registerUsername}
                            onChange={this.handleUsernameRChange}
                            data-cy="usernameField"
                            required
                        />
                        <input
                            className="log-ins"
                            type="password"
                            placeholder="Password"
                            value={this.state.registerPassword}
                            onChange={this.handlePasswordRChange}
                            data-cy="passwordField"
                            required
                        />
                        <button className="homeButtons" disabled={isDisabled1} data-cy="registerButton">
                            Register
                        </button>
                    </form>
                )}
                {this.state.newUserError !== '' && (
                    <Alert className="alert2" variant="danger">
                        {this.state.newUserError}
                    </Alert>
                )}
            </div>
        );
    }

    handleUsernameChange = event => {
        this.setState( { username: event.target.value, signInError: '' } );
    };

    handlePasswordChange = event => {
        this.setState( { password: event.target.value, signInError: '' } );
    };

    handleUsernameRChange = event => {
        this.setState( {
            registerUsername: event.target.value,
            newUserError: ''
        } );
    };

    handlePasswordRChange = event => {
        this.setState( {
            registerPassword: event.target.value,
            newUserError: ''
        } );
    };

    handleRegister = () => {
        this.setState( { showRegistration: true } );
    };

    handleSubmit = event => {
        const { username } = this.state;

        if ( !this.canBeSubmitted() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();

            const apiObj = {
                url: '/login',
                reqObjectKey: 'user_exists',
                method: 'post',
                data: {
                    username: this.state.username,
                    password: this.state.password
                }
            };
            makeAPICalls( apiObj )
                .then( userExists => {
                    if ( userExists ) {
                        localStorage.setItem( 'userLoggedIn', username );
                        this.setState( { userSignedIn: true }, () => {
                            this.props.handleLogin();
                        } );
                    } else {
                        this.setState( {
                            signInError: 'Invalid username and/or password'
                        } );
                    }
                } )
                .catch( () => {
                    this.setState( {
                        signInError: 'Invalid username and/or password'
                    } );
                } );
        }
    };

    canBeSubmitted() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        return !isDisabled;
    }

    isRegisterUserNameValid = name => {
        const regex = /[a-zA-Z0-9]/g;
        const validLength = name.length >= 6 && name.length <= 20;
        const regexMatch = name.match( regex );
        const isNameValid = regexMatch && validLength;
        return isNameValid;
    };
    isRegisterPasswordValid = password => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,30}$/g;
        const regexMatch = password.match( regex );
        return regexMatch !== null;
    };
    handleSubmit1 = event => {
        const { registerUsername, registerPassword } = this.state;

        if ( !this.canBeSubmitted1() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();
            const apiObj = {
                url: '/users',
                reqObjectKey: 'user_added',
                method: 'post',
                data: {
                    username: this.state.registerUsername,
                    password: this.state.registerPassword
                }
            };
            const regUserisValid = this.isRegisterUserNameValid( registerUsername );
            const regPsswordIsValid = this.isRegisterPasswordValid( registerPassword );
            if (
                registerUsername !== '' &&
                registerPassword !== '' &&
                regUserisValid &&
                regPsswordIsValid
            ) {
                makeAPICalls( apiObj )
                    .then( userAdded => {
                        if ( userAdded ) {
                            localStorage.setItem( 'userLoggedIn', registerUsername );
                            this.setState( { userSignedIn: true }, () => {
                                this.props.handleLogin();
                            } );
                        } else {
                            this.setState( {
                                newUserError: 'Username already exists, please sign in'
                            } );
                        }
                    } )
                    .catch( err => {
                        this.setState( {
                            newUserError: 'Username already exists, please sign in'
                        } );
                    } );
            } else {
                if ( !regUserisValid ) {
                    this.setState( {
                        newUserError: 'Username should contain min six letters . e.g. joHn12'
                    } );
                } else {
                    this.setState( {
                        newUserError:
                            'Password should contain Minimum eight characters, at least one letter (one uppercase must) and one number'
                    } );
                }
            }
        }
    };

    canBeSubmitted1() {
        const errors1 = validate( this.state.registerUsername, this.state.registerPassword );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return !isDisabled1;
    }
}
