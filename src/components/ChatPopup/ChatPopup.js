import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ChatPopup.module.scss';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import * as actions from '~/redux/actions';
import { getMessagesWithFriendService, sendMessageWithFriendService } from '~/services/chatServices';
import socket from '~/socket';
import _ from 'lodash';

const ChatPopup = ({ friend }) => {
    const userInfo = useSelector(userInfoSelector);
    const dispatch = useDispatch();

    const endOfMessagesRef = useRef(null);

    const [messages, setMessages] = useState([]);

    const [sendMessage, setSendMessage] = useState('');
    const [processingMessage, setProcessingMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getMessagesWithFriendService(friend?.id);
                setMessages(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMessages();
    }, [friend]);

    useEffect(() => {
        endOfMessagesRef.current.scrollTop = endOfMessagesRef.current.scrollHeight;
    }, [messages]);

    const handleCloseChatPopup = () => {
        dispatch(actions.closeChat(friend?.id));
    };

    const handleSendMessage = async () => {
        try {
            setMessages((prev) => [
                ...prev,
                {
                    id: null,
                    sender: userInfo?.id,
                    message: sendMessage,
                },
            ]);
            const clone = sendMessage;
            setSendMessage('');
            setProcessingMessage('Đang xử lý');
            const res = await sendMessageWithFriendService({ friendId: friend?.id, message: clone });
            setMessages((prev) => {
                const index = _.findIndex(prev, { id: null, message: clone });

                if (index === -1) return prev;

                const updatedMessages = _.cloneDeep(prev);
                updatedMessages[index] = { ...updatedMessages[index], id: res?.id };

                return updatedMessages;
            });
            setProcessingMessage('');
        } catch (error) {
            console.log(error);
            setProcessingMessage('Lỗi');
        }
    };

    useEffect(() => {
        socket.on('newMessage', (newMessage) => {
            if (newMessage.receiver === userInfo?.id) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: newMessage?.id,
                        sender: newMessage?.sender,
                        message: newMessage?.message,
                    },
                ]);
            }
        });
    }, [userInfo?.id]);

    return (
        <div className={clsx(styles['chat-wrapper'])}>
            <div className={clsx(styles['chat-header'])}>
                <div className={clsx(styles['chat-receiver'])}>{`${friend?.lastName} ${friend?.firstName}`}</div>
                <FontAwesomeIcon
                    icon={faXmark}
                    className={clsx(styles['chat-close'])}
                    onClick={() => handleCloseChatPopup(false)}
                />
            </div>
            <div ref={endOfMessagesRef} className={clsx(styles['chat-container'])}>
                {messages?.map((message, index) => {
                    return (
                        <div
                            key={`chat-${index}`}
                            className={clsx(styles['message-wrapper'], {
                                [[styles['message-current-user']]]: message?.sender === userInfo?.id,
                            })}
                        >
                            {(index === 0 && message.sender === userInfo?.id) ||
                                (messages[index - 1]?.sender !== messages[index]?.sender &&
                                    message?.sender === friend?.id && (
                                        <img
                                            className={clsx(styles['message-avatar'])}
                                            src={friend?.avatar || defaultAvatar}
                                        />
                                    ))}
                            <div className={clsx(styles['message'])}>{message?.message}</div>
                            {processingMessage &&
                                _.findLast(messages, { sender: userInfo?.id }) &&
                                _.isEqual(_.findLast(messages, { sender: userInfo?.id }), message) && (
                                    <div className={clsx(styles['process-message'])}>{processingMessage}</div>
                                )}
                        </div>
                    );
                })}
                <div></div>
            </div>
            <div className={clsx(styles['chat-footer'])}>
                <div className={clsx(styles['send-message-wrapper'])}>
                    <input
                        value={sendMessage}
                        className={clsx(styles['send-message'])}
                        placeholder="Aa"
                        onChange={(e) => setSendMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />
                    {sendMessage ? (
                        <i className={clsx(styles['send-message-btn'])} onClick={handleSendMessage}></i>
                    ) : (
                        <FontAwesomeIcon className={clsx(styles['link-icon'])} icon={faThumbsUp} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
