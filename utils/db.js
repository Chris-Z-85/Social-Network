const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/socialnetwork`);

exports.addUser = function (first, last, email, password) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) 
        RETURNING id, first, last, email, password
        `,
        [first, last, email, password]
    );
};

exports.getUser = function (id) {
    return db.query(
        `
        SELECT id, first, last, image, bio
        FROM users
        WHERE id = $1
        `,
        [id]
    );
};

exports.getUserByEmail = function (email) {
    return db.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email]
    );
};

exports.addCode = function (email, code) {
    return db.query(
        `
        INSERT INTO password_reset_codes (email, code)
        VALUES ($1, $2) 
        RETURNING id, email, code, created_at
        `,
        [email, code]
    );
};

exports.getCode = function (email) {
    return db.query(
        `
        SELECT code FROM password_reset_codes
        WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        `,
        [email]
    );
};

exports.updatePass = function (email, password) {
    return db.query(
        `
        UPDATE users
        SET password = $2
        WHERE email = $1
        `,
        [email, password]
    )
};

exports.uploadImage = function (url, userId) {
    return db.query(
        `
        UPDATE users SET image = $1
        WHERE id = $2
        RETURNING image
        `,
        [url, userId]
    );
};

exports.updateBio = function (userId, bio) {
    return db.query(
        `
        UPDATE users SET bio = $2
        WHERE id = $1
        RETURNING bio
        `,
        [userId, bio]
    );
};

exports.recentUsers = function () {
    return db.query(
        `
        SELECT *
        FROM users
        ORDER BY id DESC
        LIMIT 3
        `
    );
};

exports.matchingUsers = function (val) {
    return db.query(
        `
        SELECT * 
        FROM users 
        WHERE first ILIKE $1 OR last ILIKE $1
        `,
        [val + "%"]
    );
};

exports.allUsers = function () {
    return db.query(
        `
        SELECT * 
        FROM users 
        `
    );
};

exports.selectFriendship = function (receiver_id, sender_id) {
    return db.query(
        `
        SELECT * 
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        `,
        [receiver_id, sender_id]
    );
};

exports.insertFriendship = function (receiver_id, sender_id) {
    return db.query(
        `
        INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING id
        `,
        [receiver_id, sender_id]
    );
};

exports.updateFriendship = function (receiver_id, sender_id) {
    return db.query(
        `
        UPDATE friendships 
        SET accepted=true 
        WHERE (sender_id=$1 AND receiver_id=$2) 
        OR (sender_id=$2 AND receiver_id=$1)
        RETURNING id, accepted
        `,
        [receiver_id, sender_id]
    );
};

exports.deleteFriendship = function (receiver_id, sender_id) {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        `,
        [receiver_id, sender_id]
    );
};

exports.getFriendsWannabes = function (userId) {
    return db.query(
        `
        SELECT users.id, first, last, image, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
        [userId]
    );
};

exports.getLastTenChatMesssages = function () {
    return db.query(
        `
        SELECT chats.id, chats.sender_id, chats.message_text, chats.created_at, users.first, users.last, users.image 
        FROM chats
        JOIN users
        ON chats.sender_id = users.id
        ORDER BY created_at DESC
        LIMIT 10
        `
    );
};

exports.insertMessage = function (userId, message, ) {
    return db.query(
        `
        INSERT INTO chats (sender_id, message_text)
        VALUES ($1, $2)
        RETURNING id, created_at
        `,
        [userId, message]
    );
};