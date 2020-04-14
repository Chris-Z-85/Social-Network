import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [matchingUsers, setMatchingUsers] = useState([]);

    useEffect(() => {
        axios
            .get("/recentUsers")
            .then(({ data }) => {
                setMatchingUsers(data);
            })
            .catch(err => {
                console.log("Error in findpeople: ", err);
            });
    }, []);


    const searchUser = (e) => {
        let word = e.target.value
        if (word == "") {
            word = "all"
        }

        axios
            .get(`/matchingUsers/${word}`)
            .then(({ data }) => {
                setMatchingUsers(data)
            })
            .catch(err => {
                console.log("Error in findpeople - matchingusers: ", err);
            });
    }

    return (
        <div className="people-container">
            <div className="search-container">
                <h3>Looking for someone special?</h3>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Enter first or last name"
                    onChange={searchUser}
                />
                {matchingUsers.map(user => (
                    <div className="findpeople-card" key={user.id}>
                        <img src={user.image || './default.png'} />
                        <Link to={`/user/${user.id}`}>
                            {user.first} {user.last}
                        </Link>
                    </div>
                ))}
            </div>
            <div className="quote">
                <h1>“ Friends are people who know you really well and like you anyway. “</h1>
            </div>
            <div className="peggy">
                <img src="./peggy.png" />
            </div>
        </div>
    );
}