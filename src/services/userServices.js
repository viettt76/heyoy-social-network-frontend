import axios from '~/utils/axios';

export const signUpService = ({ firstName, lastName, username, password }) => {
    return axios.post('/user/signup', {
        firstName,
        lastName,
        username,
        password,
    });
};

export const loginService = ({ username, password }) => {
    return axios.post('/user/login', {
        username,
        password,
    });
};

export const getPersonalInfoService = () => {
    return axios.get('/user/personal-info');
};

export const logoutService = () => {
    return axios.post('/user/logout');
};
