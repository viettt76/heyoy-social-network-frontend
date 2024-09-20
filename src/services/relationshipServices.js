import axios from '~/utils/axios';

export const allFriendsService = () => {
    return axios.get('/relationships/friends');
};

export const friendSuggestionsService = () => {
    return axios.get('/relationships/suggestion');
};

export const sendFriendRequestService = (receiverId) => {
    return axios.post('/relationships/request', { relationship: 1, receiverId });
};

export const getFriendRequestService = () => {
    return axios.get('/relationships/request');
};

export const refuseFriendRequestService = (senderId) => {
    return axios.delete(`/relationships/request/${senderId}`);
};

export const acceptFriendshipService = (friendId) => {
    return axios.post('/relationships/accept', { friendId });
};

export const unfriendService = (friendId) => {
    return axios.delete(`/relationships/${friendId}`);
};
