import React, { useContext } from 'react';
import axios from './axios';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import Profile from './profile';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import OtherProfile from './otherprofile';
import Findpeople from './findpeople';
import Friends from './friends';
import Chat from './chat';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            redirectToLogin: false,

        };

        this.updateBio = this.updateBio.bind(this)
        this.setUploaderVisible = this.setUploaderVisible.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {

        axios.get("user-logged")
            .then(({ data }) => {
                if (data.isLogged) {
                    axios.get("/user")
                        .then(({ data }) => {
                            // console.log(data)
                            let bio = data.bio == null ? "" : data.bio
                            this.setState({ ...data, bio },

                                () => console.log(this.state));
                        })
                        .catch(err => console.log(err));
                } else {
                    window.location = "http://localhost:8080/welcome#/"
                }
            })

    }

    updateBio(bio) {
        this.setState({ bio })
    }

    setUploaderVisible(uploaderVisible) {
        this.setState({ uploaderVisible })
    }

    logout() {
        console.log("logout")
        axios.get("/logout")
            .then(() => {
                window.location = "http://localhost:8080/welcome#/"
            })
            .catch(err => console.log(err));
    }

    render() {
        if (!this.state.id) {
            return null
        }
        return (
            <>
                <BrowserRouter>
                    <div className="navbar">
                        <div className="logo-container">
                            <img src="./logo.png" alt="logo" id="logo" />
                        </div>


                        {this.state.uploaderVisible && <Uploader id={this.state.id} finishedUploading={res => {
                            this.setState({ image: res.data.image })
                            console.log(res.data.image)
                        }
                        }
                            setUploaderVisible={this.setUploaderVisible}
                        />}

                        <div className="navbar-links-container">
                            <Link to="/#">Profile 🧑</Link>
                            <Link to="/friends">My Buddies 🤝</Link>
                            <Link to="/users">Buddy search 👨‍👩‍👧</Link>
                            <Link to="/chat">Chat room 🍺</Link>
                        </div>

                        <div className="profile-pic-container">
                            <ProfilePic
                                url={this.state.image}
                                clickHandler={() => this.setState({ uploaderVisible: true })}
                            />
                            <button onClick={this.logout}>Logout</button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <Route exact path="/" render={() => (
                            <Profile
                                url={this.state.image}
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                updateBio={this.updateBio}
                            />
                        )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={Findpeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>

            </>
        );
    }
}