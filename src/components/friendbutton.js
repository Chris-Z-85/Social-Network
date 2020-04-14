import React, { useState, useEffect } from 'react';
import axios from "./axios.js";
import { useDispatch } from 'react-redux';
import { acceptFriendRequest, endFriendship } from './actions.js';

export default function FriendButton({ otherUserId }) {

    const dispatch = useDispatch()

    const [buttonText, setButtonText] = useState('Make Friend Request');
    useEffect(() => {
        axios
            .get(`/initial-friendship-status/${otherUserId}`)
            .then(({ data }) => {
                console.log(data)
                if (data.isFriend == false && data.isInvited == false) {
                    setButtonText("Make friend request");
                }

                if (data.isFriend == false && data.isInvited == true) {
                    setButtonText("Cancel friend request");
                }

                if (data.isFriend == true && data.isInvited == true) {
                    setButtonText("End friendship");
                }

                if (data.invitedUs == true) {
                    setButtonText("Accept friendship");
                }
            })
            .catch(err => {
                console.log("Error in GET initial-friendship-status: ", err);
            });
    }, []);

    const handleClick = (e) => {
        e.preventDefault();

        if (buttonText == "Make friend request") {
            axios
                .post(`/make-friend-request/${otherUserId}`)
                .then(({ data }) => {
                    console.log("Make friend request was made: ", data);
                    setButtonText("Cancel friend request");
                });
        }

        if (buttonText == "Accept friendship") {
            dispatch(acceptFriendRequest(otherUserId))
        }

        if (
            buttonText == "Cancel friend request" ||
            buttonText == "End friendship"
        ) {
            dispatch(endFriendship(otherUserId))
        }

    };

    return (
        <button onClick={handleClick}>{buttonText}</button>
    );

};