import { OPEN_CHAT, CLOSE_CHAT } from '../actions/chatActions';

const initialState = {
    openChats: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CHAT:
            if (state.openChats.some((chat) => chat?.id === action.payload?.id)) {
                return {
                    ...state,
                };
            }
            return {
                ...state,
                openChats: [action.payload, ...state.openChats],
            };
        case CLOSE_CHAT: {
            const i = state.openChats.findIndex((c) => c?.id === action.payload);
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
