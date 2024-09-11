import axios from '~/utils/axios';

export const submitPostService = ({ visibility = 1, content = '', images = [] }) => {
    return axios.post('/posts', {
        visibility,
        content,
        images,
    });
};

export const getAllPostsService = () => {
    return axios.get('/posts');
};

export const getAllEmotionsService = () => {
    return axios.get('/posts/emotions');
};

export const releaseEmotionPostService = ({ postId, emotionId }) => {
    return axios.put(`/posts/emotion/${postId}`, { emotionId });
};

export const cancelReleasedEmotionPostService = ({ postId }) => {
    return axios.delete(`/posts/emotion/${postId}`);
};

export const getMyPostService = () => {
    return axios.get('/posts/me');
};
