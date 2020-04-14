import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            success: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then(resp => {
                let { data } = resp
                console.log(data)
                if (!data.success) {
                    this.setState({ success: false })

                    return
                }
                location.replace('/')
                this.setState({ success: true })

            })
            .catch(function (err) {
                console.log("err in POST /login: ", err);
            });

        if (!this.state.email) {
            this.setState({ errorEmail: 'Email is missing!' });

        }
        if (!this.state.password) {
            this.setState({ errorPassword: 'Password is missing!' });

        }
    }

    render() {
        return (
            <div className="registration-container">
                <h3>Log in:</h3>
                <form>
                    {
                        this.state.success ?
                            null
                            :
                            <p style={{ color: "red", textAlign: "center" }}>
                                Wrong password or email
                            </p>
                    }
                    <div className="register-container">
                        <input onChange={this.handleChange} name='email' type='text' placeholder='E-mail' />
                        <input onChange={this.handleChange} name='password' type='password' placeholder='Password' />
                    </div>
                    <div className="register-button-container">
                        <button onClick={this.handleSubmit} type="submit">Go !</button>
                    </div>
                    <div className="login-now-container">
                        <p>Forgot password?</p>
                        <Link to="/reset">Reset it here!</Link>
                    </div>
                </form>
            </div>
        );
    }
}

