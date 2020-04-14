import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, acceptFriendRequest, endFriendship } from "./actions.js";
import FriendButton from "./friendbutton.js";

export default function FriendsAndWannabes() {

    const dispatch = useDispatch()
    const friendsArray = useSelector(state => state.friends)

    useEffect(() => {
        dispatch(receiveFriendsWannabes())
    }, [])


    return (
        <div>
            <div className="buddies-container">
                <div className="friends">
                    <h3>Here are my buddies:</h3>
                    <div className="friends-container">
                        {
                            friendsArray.map((user, key) => {
                                if (user.accepted) {
                                    return (
                                        <div className="friend-card" key={key}>
                                            <img src={user.image || './default.png'} />
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                marginLeft: 10
                                            }}>
                                                <Link to={`/user/${user.id}`}>
                                                    {user.first} {user.last}
                                                </Link>
                                                <FriendButton otherUserId={user.id} />
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className="al-house-container">
                    <img src="./al_house.jpg" id="al_house" />
                </div>
                <div className="wannabes">
                    <h3>Here are some friend wannabes:</h3>
                    <div className="friends-container">
                        {
                            friendsArray.map((user, key) => {
                                if (!user.accepted) {
                                    return (
                                        <div className="friend-card" key={key}>
                                            <img src={user.image || './default.png'} />
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                marginLeft: 10
                                            }}>
                                                <Link to={`/user/${user.id}`}>
                                                    {user.first} {user.last}
                                                </Link>
                                                <FriendButton otherUserId={user.id} />
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}