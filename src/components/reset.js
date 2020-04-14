import React from 'react';
import axios from "./axios";


export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errormessage: "",
            currentDisplay: 1
        };

        this.handleChange = this.handleChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log("this.state: ", this.state);
            }
        );
    }

    sendEmail(e) {
        e.preventDefault();

        let email = this.state.email
        axios
            .post("/password/reset/start", this.state)
            .then((results) => {
                if (results.data.success) {
                    this.setState({ currentDisplay: 2, errormessage: false });
                } else {
                    this.setState({ errormessage: true });
                }
            })
            .catch(err => {
                console.log("err in sendEmail", err);
                this.setState({ errormessage: true });
            });
    }

    ResetPassword(e) {
        e.preventDefault();
        axios
            .post("/password/reset/verify", this.state)
            .then((results) => {
                if (results.data.success) {
                    this.setState({ currentDisplay: 3, errormessage: false });
                } else {
                    this.setState({ errormessage: true });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="registration-container">
                {this.state.currentDisplay == 1 && (
                    <div className="registration-container">
                        <h3>Reset Password</h3>
                        {this.state.errormessage && (
                            <p style={{ color: "red", textAlign: "center" }}>Something went wrong: Please try again</p>
                        )}
                        <h4>Please enter email you registered with:</h4>
                        <form onSubmit={this.sendEmail}>
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="email"
                            />
                            <div className="register-button-container">
                                <button>Submit</button>
                            </div>
                        </form>

                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div>
                        <form onSubmit={this.changePassword}>
                            <h3>Please enter the code you received</h3>
                            <input
                                onChange={this.handleChange}
                                name="code"
                                type="text"
                                placeholder="code"
                            />
                            <input
                                onChange={this.handleChange}
                                name="password"
                                type="text"
                                placeholder="password"
                            />
                            <button>Submit</button>
                        </form>
                        {this.state.errormessage && (
                            <div>Ups, something went wrong, please try again.</div>
                        )}
                    </div>
                )}
                {this.state.currentDisplay == 3 && (
                    <div>
                        <h1>Password was changed successfully</h1>
                        {this.state.errormessage && (
                            <div>Ups, something went wrong, please try again.</div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}