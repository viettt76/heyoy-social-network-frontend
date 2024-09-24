import axios from '~/utils/axios';

export const getPersonalInfoService = () => {
    return axios.get('/user/personal-info');
};

export const updatePersonalInfoService = ({ homeTown, school, workplace, avatar, birthday }) => {
    return axios.put('/user/personal-info', { homeTown, school, workplace, avatar, birthday });
};
