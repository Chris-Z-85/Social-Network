const INITIAL_STATE = {
    friends: [],
    users: []
}


export default function (state = INITIAL_STATE, action) {

    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state, friends: action.friends
        }
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.otherUserId) {
                    return {
                        ...friend,
                        accepted: true
                    };
                } else {
                    return friend;
                }
            })
        }
    }

    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            friends: state.friends.filter(
                friend => friend.id != action.otherUserId
            )

        };
    }

    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type == "SEND_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage]
        };
    }

    if (action.type == "UPDATE_USERS") {
        state = {
            ...state,
            users: action.users
        };
    }
    return state;
}