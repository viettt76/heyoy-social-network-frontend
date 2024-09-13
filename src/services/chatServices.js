import axios from '~/utils/axios';

export const getMessagesWithFriendService = (friendId) => {
    return axios.get(`/chat/messages?friendId=${friendId}`);
};

export const sendMessageWithFriendService = ({ friendId, message }) => {
    return axios.post('/chat/message', {
        friendId: friendId,
        message: message,
    });
};
