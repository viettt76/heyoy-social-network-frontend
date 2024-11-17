import axios from '~/utils/axios';

export const signUpService = ({ firstName, lastName, username, password }) => {
    return axios.post('/auth/signup', {
        firstName,
        lastName,
        username,
        password,
    });
};

export const loginService = ({ username, password }) => {
    return axios.post('/auth/login', {
        username,
        password,
    });
};

export const logoutService = () => {
    return axios.post('/auth/logout');
};

export const deleteAccountService = (password) => {
    return axios.delete('/auth/delete-account', { data: { password } });
};

export const recoverAccountService = ({ username, password }) => {
    return axios.post('/auth/recover-account', { username, password });
};

export const changePasswordService = ({ currentPassword, newPassword }) => {
    return axios.patch('/auth/change-password', {
        currentPassword,
        newPassword,
    });
};
