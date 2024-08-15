import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function (response) {
        const customResponse = {
            data: response.data?.data,
            status: response.status,
        };
        return customResponse;
    },
    function (error) {
        if (error?.response?.data)
            return Promise.reject({
                status: error?.response?.status,
                data: error?.response?.data,
            });
        return Promise.reject(error);
    },
);

export default instance;
