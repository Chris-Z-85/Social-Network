import React from 'react';

export default function ProfilePic({ url, first, last, clickHandler }) {
    return (
        <img
            id="profile-pic-small"
            src={url || './default.png'}
            alt={`${first} ${last}`}
            onClick={clickHandler}
        />

    );
}