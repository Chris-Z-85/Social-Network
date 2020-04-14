import axios from "axios";

export async function receiveFriendsWannabes() {

    const { data } = await axios.get("/friends-wannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data
    };
}

export async function acceptFriendRequest(otherUserId) {
    const { data } = await axios.get(`/accept-friend-request/${otherUserId}`);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        otherUserId: otherUserId
    };
}

export async function endFriendship(otherUserId) {
    const { data } = await axios.get(`/end-friendship/${otherUserId}`);
    return {
        type: "END_FRIENDSHIP",
        otherUserId: otherUserId
    };
}

export function chatMessages(msgs) {
    return {
        type: "GET_MESSAGES",
        chatMessages: msgs
    };
}

export function chatMessage(msg) {
    return {
        type: "SEND_MESSAGE",
        chatMessage: msg
    };
}

export function updateUsers(users) {
    return {
        type: "UPDATE_USERS",
        users
    };
}