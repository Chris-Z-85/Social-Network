import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.first.trim() == "") {
            this.setState({ error: 'First name is missing!' });
            return
        }
        if (this.state.last.trim() == "") {
            this.setState({ error: 'Last name is missing!' });

        }
        if (this.state.email.trim() == "") {
            this.setState({ error: 'Email is missing!' });
            return
        }
        if (this.state.password.trim() == "") {
            this.setState({ error: 'Password is missing!' });
            return
        }

        axios
            .post("/registration", this.state)
            .then(resp => {
                location.replace("/");

            })
            .catch(function (err) {
                console.log("err in POST /registation: ", err);
            });

    }

    render() {
        return (
            <div className="registration-container">
                <h3>Register here:</h3>
                {
                    this.state.error ?
                        <div style={{ color: "red", textAlign: "center" }}>
                            {this.state.error}
                        </div>
                        :
                        null
                }
                <form>
                    <div className="register-container">
                        <input onChange={this.handleChange} name='first' type='text' value={this.state.first} placeholder='First name' />
                        <input onChange={this.handleChange} name='last' type='text' value={this.state.last} placeholder='Last name' />
                    </div>
                    <div className="register-container">
                        <input onChange={this.handleChange} name='email' type='email' value={this.state.email} placeholder='E-mail' />
                        <input onChange={this.handleChange} name='password' value={this.state.password} type='password' placeholder='Password' />
                    </div>
                    <div className="register-button-container">
                        <button onClick={this.handleSubmit} type="submit">Join now!</button>
                    </div>
                    <div className="login-now-container">
                        <div><p>Already a member? </p></div>
                        <div><p><Link to="/login"> Log in!</Link></p></div>
                    </div>
                </form>
            </div>
        );
    };
};

