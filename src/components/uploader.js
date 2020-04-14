import React from 'react';
import axios from './axios.js'

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.upload = this.upload.bind(this);


    }

    handleChange(e) {
        this.setState(
            {
                file: e.target.files[0]
            }
        )
    };

    upload(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/uploadImage", formData)
            .then(data => {
                this.props.finishedUploading(data);
            });
    }

    render() {

        return (
            <div id="uploader">
                <div id="uploader_close" onClick={() => { this.props.setUploaderVisible(false) }}>
                    X
                </div>
                <h2>Want to change your image?</h2>
                <input onChange={this.handleChange} type='file' name='file' id='file' accept='image/*' />
                <button onClick={this.upload}>Upload</button>
            </div>
        );
    }

}