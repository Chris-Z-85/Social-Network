import React from 'react';
import axios from 'axios';
import FriendButton from "./friendbutton.js";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get(`/user/${this.props.match.params.id}.json`).then(
            ({ data }) => {
                if (data.redirectTo == '/') {
                    this.props.history.push('/');
                } else {
                    this.setState(data.user);
                }
            }
        )
    }
    render() {
        return (
            <div>
                <h2>
                    {this.state.first} {this.state.last}
                </h2>
                <div id="profile-content">
                    <div>
                        <img
                            id="profile-pic-big"
                            src={this.state.image || './default.png'}
                        />

                    </div>
                    <div style={{ marginLeft: 20 }}>
                        {this.state.bio}
                    </div>

                </div>
                <FriendButton otherUserId={this.props.match.params.id} />

            </div>
        );
    }
}