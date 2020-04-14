const express = require('express');
const app = express();
const compression = require('compression');
const csurf = require('csurf');
const cookieSession = require('cookie-session');
const {
    addUser,
    getUserByEmail,
    addCode,
    getCode,
    updatePass,
    getUser,
    uploadImage,
    updateBio,
    recentUsers,
    matchingUsers,
    allUsers,
    selectFriendship,
    insertFriendship,
    updateFriendship,
    deleteFriendship,
    getFriendsWannabes,
    getLastTenChatMesssages,
    insertMessage

} = require('./utils/db');
const { hash, compare } = require('./utils/bc');
const cryptoRandomString = require('crypto-random-string');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require("./s3");
const { s3Url } = require("./config")
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.static('./public'));

app.use(express.json());

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use((req, res, next) => {
    res.set('x-frame-option', 'deny');
    res.cookie('csrftoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    let { first, last, email, password } = req.body;
    hash(password).then(hashedPw => {
        addUser(first, last, email, hashedPw)
            .then(response => {
                req.session.userId = response.rows[0].id;
                res.json(response.rows[0]);
            })
            .catch(err => {
                console.log("error in catch:", err);
                res.json(err);
            });


    });
})

app.post("/login", (req, res) => {
    let { email, password } = req.body;

    getUserByEmail(email).then(data => {
        if (data.rows.length == 0) {
            res.json({ success: false });
            return
        }

        let hash = data.rows[0].password

        compare(password, hash).then(correct => {
            if (correct) {
                req.session.userId = data.rows[0].id
                res.json({ success: true });
            } else {
                res.json({ success: false });
                return
            }
        })
    })
})

app.post("/password/reset/start", (req, res) => {
    let { email } = req.body
    getUserByEmail(email).then(data => {
        if (data.rows.length == 0) {
            res.json({ success: false });
            return
        }
        const secretCode = cryptoRandomString({
            length: 6
        });

        addCode(email, secretCode)
            .then(data => {
                res.json({ success: true });
            })
            .catch(err => {
                console.log(err)
                res.json({ success: false });
            })

    })
})

app.post("/password/reset/verify", (req, res) => {
    const { email, code, password } = req.body.data;
    getCode(email).then(({ rows }) => {
        if (rows[0]) {
            if (code === rows[0].code) {
                hash(password)
                    .then(hashedPw => {
                        updatePass(email, hashedPw)
                            .then(() => {
                                res.json({
                                    success: true
                                })
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));

            } else {
                res.json({
                    err: "Code does not match"
                });
            }
        } else {
            res.json({
                err: "Code is no loger valid"
            })
        }
    })
        .catch(err => console.log(err));
});


app.get("/user", (req, res) => {
    getUser(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);

        }).catch(err => { console.log("error in getUser: ", err) })
});


app.post("/uploadImage", uploader.single('file'), s3.upload, (req, res) => {

    if (req.file) {
        let url = s3Url + req.file.filename;
        let userId = req.session.userId;

        uploadImage(url, userId)
            .then(function (result) {
                res.json({
                    image: result.rows[0].image
                })
            }).catch(err => { console.log("error in uploadImage: ", err) })

    } else {
        res.json({
            success: false
        });
    };

});


app.post("/updatebio", (req, res) => {
    updateBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
            console.log(rows)
            res.json({ rows });
        })
        .catch(err => console.log("error in updateBio: ", err));
});


app.get("/user/:id.json", (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.json(
            { redirectTo: "/" }
        );
    } else {
        getUser(req.params.id)
            .then(function (result) {
                res.json({ user: result.rows[0] })
            })
    }
})


app.get("/recentUsers", (req, res) => {
    recentUsers()
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log("error in recentUsers: ", err);
        });
});


app.get("/matchingUsers/:word", (req, res) => {
    let word = req.params.word

    if (word == "all") {
        allUsers()
            .then(result => {
                res.json(result.rows);
            })
            .catch(err => {
                console.log("error in getMatchingUsers: ", err);
            });
        return
    }

    matchingUsers(word)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log("error in getMatchingUsers: ", err);
        });
});


app.get("/initial-friendship-status/:id", (req, res) => {
    let receiver_id = req.params.id;
    let sender_id = req.session.userId;
    selectFriendship(receiver_id, sender_id)
        .then(result => {

            selectFriendship(sender_id, receiver_id)
                .then(r => {

                    if (result.rows.length == 0 && r.rows.length == 0) {
                        res.json({ isFriend: false, isInvited: false })
                        return
                    }

                    if (r.rows.length > 0) {
                        let obj = r.rows[0]
                        if (obj.accepted) {
                            res.json({ isFriend: true, isInvited: true, invitedUs: false })
                        } else {
                            res.json({ isFriend: false, isInvited: false, invitedUs: true })
                            return
                        }

                    }

                    if (result.rows.length > 0) {
                        let obj = result.rows[0]
                        if (obj.accepted) {
                            res.json({ isFriend: true, isInvited: true })
                            return
                        } else {
                            res.json({ isFriend: false, isInvited: true })
                            return
                        }
                    }
                })

        }).catch(err => {
            console.log("error in selectFriendship: ", err);
        });
});


app.post("/make-friend-request/:id", (req, res) => {
    let receiver_id = req.params.id;
    let sender_id = req.session.userId;
    insertFriendship(receiver_id, sender_id)
        .then(result => {
            res.json(result);
        }).catch(err => {
            console.log("error in insertFriendship: ", err);
        });
});


app.get("/accept-friend-request/:id", (req, res) => {
    let receiver_id = req.params.id;
    let sender_id = req.session.userId;
    updateFriendship(receiver_id, sender_id)
        .then(result => {
            res.json(result.rows[0]);
        }).catch(err => {
            console.log("error in updateFriendship: ", err);
        });
});


app.get("/end-friendship/:id", (req, res) => {
    let receiver_id = req.params.id;
    let sender_id = req.session.userId;
    deleteFriendship(receiver_id, sender_id)
        .then(result => {
            res.json(result.rows[0]);
        }).catch(err => {
            console.log("error in deleteFriendship: ", err);
        });
});


app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.status(200).end()
});

app.get("/friends-wannabes", (req, res) => {
    let userId = req.session.userId;
    console.log("friends wannabes running");
    getFriendsWannabes(userId)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log("error in getFriendsandWannabe: ", err);
        });
});

app.get("/user-logged", (req, res) => {
    if (req.session.userId) {
        res.json({ isLogged: true })
    } else {
        res.json({ isLogged: false })
    }
})

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


server.listen(8080, function () {
    console.log("I'm listening.");
});


let users = []

io.on('connection', function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    getUser(userId)
        .then(({ rows }) => {
            let user = rows[0]
            users.push(user)
        })

    let usersToSend = users.filter(user => user.id !== userId)
    socket.emit('updateUsers', { users: usersToSend })

    getLastTenChatMesssages().then(data => {
        io.sockets.emit('chatMessages', data.rows);
    }).catch(err => {
    });

    socket.on('newMessage', newMsg => {

        getUser(userId).then(({ rows }) => {
            let user = rows[0]

            insertMessage(userId, newMsg)
                .then(data => {
                    let chatMessage = {
                        id: data.rows[0].id,
                        sender_id: user.id,
                        message_text: newMsg,
                        created_at: data.rows[0].created_at,
                        first: user.first,
                        last: user.last,
                        image: user.image
                    };
                    io.sockets.emit("newMessage", chatMessage);
                });
        });
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== userId)
        io.sockets.emit('updateUsers', { users })
    })
});