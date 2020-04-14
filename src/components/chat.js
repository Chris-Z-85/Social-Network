import React, { useEffect, useRef } from 'react';
import { socket } from './socket';
import { useSelector } from 'react-redux';

export default function Chat() {
    const chatMessages = useSelector(
        state => state && state.chatMessages
    );

    const chatUsers = useSelector(
        state => state.users
    )

    const elementRef = useRef();

    useEffect(() => {
        elementRef.current.scrollTop = elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            socket.emit('newMessage', e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <div>
                <img src="./family3.png" />
            </div>
            <div className="chat-room-container">
                <h3>💬 Chat with buddies </h3>
                <div className="chat-container" ref={elementRef}>
                    {chatMessages &&
                        chatMessages.sort((a, b) => a.id - b.id).map((user, key) => (
                            <div className="chat-message" key={key}>
                                <div className="chat-message-user">
                                    <p className="user-chat-name">{`${user.first} ${user.last}`}</p>
                                    <p className="date-in-chat">{new Date(user.created_at).toLocaleString()}</p>
                                </div>
                                <div className="chat-message-text">
                                    <div className="chat-img">
                                        <img
                                            src={user.image || "/default.png"}
                                            alt={`${user.first} ${user.last}`}
                                        />
                                    </div>
                                    <div className="msg-in-chat">
                                        {user.message_text}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <textarea className="message-container" placeholder="Say something here" onKeyDown={keyCheck} />
            </div>
            <div className="users-online-container">
                <div>👀 Users online:</div>
                <div className="users-online">
                    {
                        chatUsers.map(user => {
                            return (
                                <div className="chat-user">
                                    <img
                                        src={user.image || "/default.png"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}