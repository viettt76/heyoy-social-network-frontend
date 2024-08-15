export const SAVE_USER_INFO = 'SAVE_USER_INFO';

export const saveUserInfo = (payload) => {
    return {
        type: SAVE_USER_INFO,
        payload,
    };
};
