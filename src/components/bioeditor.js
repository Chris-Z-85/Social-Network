import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: this.props.bio
        };

        this.openEditor = this.openEditor.bind(this)
        this.editArea = this.editArea.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveBio = this.saveBio.bind(this)
    }

    componentDidMount() {
        this.setState({
            bioEditor: false,
        });
    }

    editArea() {
        this.setState({ textAreaAppear: true });
    }


    handleChange(e) {
        this.props.updateBio(e.target.value)
        this.setState({
            bio: e.target.value
        })
    }

    openEditor() {
        this.setState({
            bioEditor: true
        })
    }

    saveBio() {
        this.setState({
            bioEditor: false
        })
        this.props.updateBio(this.state.bio)

        axios
            .post("/updatebio", { bio: this.state.bio }).then(results => { })

    }

    render() {
        return (
            <div>
                <h3>About me:</h3>
                {
                    this.state.bioEditor ?
                        <>
                            <textarea value={this.state.bio} cols="20" rows="5" onChange={this.handleChange}></textarea>
                            <button onClick={this.saveBio}>Save</button>
                        </>
                        :
                        <>
                            <div>
                                <p style={{ width: 600 }}>
                                    {this.state.bio}
                                </p>
                                {
                                    this.state.bio.trim() == "" ?
                                        <button onClick={this.openEditor}>Add your bio now</button>
                                        :
                                        <button onClick={this.openEditor}>Edit</button>
                                }
                            </div>
                        </>
                }
            </div>
        )
    }
}