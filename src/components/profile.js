import React from "react";
import Bioeditor from './bioeditor';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div>
                <div>
                    <h2>
                        Hello, {this.props.first} {this.props.last} !
                </h2>
                </div>
                <div className="profile-container">

                    <div id="profile-content">
                        <div>
                            <img
                                id="profile-pic-big"
                                src={this.props.url || './default.png'}
                            />
                        </div>
                        <div style={{ marginLeft: 20 }} className="bio-container">
                            <Bioeditor
                                bio={this.props.bio}
                                updateBio={this.props.updateBio}
                            />
                        </div>
                    </div>
                    <div className="family-container">
                        <img src="./family.png" />
                    </div>
                </div>
            </div>
        );
    }
}