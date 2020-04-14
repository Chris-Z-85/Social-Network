import * as io from 'socket.io-client';

import { chatMessages, chatMessage, updateUsers } from './actions';
let socket = io.connect()
export { socket };

export const init = store => {
    console.log("init!")
    // socket = io.connect();
    console

    socket.on(
        'chatMessages',
        msgs => {
            console.log("chat messages")
            store.dispatch(
                chatMessages(msgs)
            )
        }
    );

    socket.on(
        'newMessage',
        msg => {
            console.log("chat message")
            store.dispatch(
                chatMessage(msg)
            )
        }
    );

    socket.on(
        'updateUsers',
        data => {
            let { users } = data
            store.dispatch(
                updateUsers(users)
            )
        }
    )
};