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

export const getMyPostService = (userId) => {
    return axios.get(`/posts/user/${userId}`);
};

export const sendCommentService = ({ postId, parentCommentId = null, content }) => {
    return axios.post('/posts/comment', {
        postId,
        parentCommentId,
        content,
    });
};

export const getCommentsService = ({ postId, sortField = 'createdAt', sortType = 'DESC' }) => {
    return axios.get(`/posts/comments/${postId}`, {
        params: {
            sortField,
            sortType,
        },
    });
};

export const releaseEmotionCommentService = ({ commentId, emotionId }) => {
    return axios.put(`/posts/comment/emotion/${commentId}`, {
        emotionId,
    });
};

export const getPostsNotApprovedService = () => {
    return axios.get('/posts/not-approved');
};

export const approvePostService = (postId) => {
    return axios.patch(`/posts/approve/${postId}`);
};

export const denyPostService = (postId) => {
    return axios.put(`/posts/deny/${postId}`);
};
