import React from 'react';
import Registration from './registration';
import ResetPassword from './reset'
import Login from './login'
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';

export default function Welcome() {
    return (

        <div>
            <div className="welcome-container">
                <h1>Welcome to</h1>
                <img src="./logo.png" alt="logo" id="welcome-logo" />
                <h2>Social Platform for Families</h2>
                <img src="./family2.png" id="welcome-pic" />
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>

        </div>
    );
}