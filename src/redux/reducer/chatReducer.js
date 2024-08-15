import { OPEN_CHAT, CLOSE_CHAT } from '../actions/chatActions';

const initialState = {
    openChats: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CHAT:
            return {
                ...state,
                openChats: [...state.openChats].unshift(action.payload),
            };
        case CLOSE_CHAT: {
            const i = state.openChats.indexOf((c) => c === action.payload);
            state.openChats.splice(i, 1);

            return {
                ...state,
                openChats: [...state.openChats],
            };
        }
        default:
            return state;
    }
};

export default chatReducer;
