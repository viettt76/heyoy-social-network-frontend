import { SAVE_USER_INFO } from '../actions/userActions';

const initialState = {
    id: null,
    firstName: null,
    lastName: null,
    age: null,
    avatar: null,
    homeTown: null,
    school: null,
    workplace: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER_INFO:
            return {
                ...state,
                id: action.payload?.id,
                firstName: action.payload?.firstName,
                lastName: action.payload?.lastName,
                age: action.payload?.age,
                avatar: action.payload?.avatar,
            };
        default:
            return state;
    }
};

export default userReducer;