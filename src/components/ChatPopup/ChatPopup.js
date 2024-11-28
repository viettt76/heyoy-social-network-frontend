import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPaperclip, faPhone, faThumbsUp, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ChatPopup.module.scss';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsMessengerSelector, userInfoSelector } from '~/redux/selectors';
import * as actions from '~/redux/actions';
import {
    emotionMessageService,
    getMessagesWithFriendService,
    sendMessageWithFriendService,
} from '~/services/chatServices';
import socket from '~/socket';
import { findIndex, cloneDeep, findLast, isEqual } from 'lodash';
import useClickOutside from '~/hook/useClickOutside';
import { calculateTime, uploadToCloudinary } from '~/utils/commonUtils';
import { readNotificationService } from '~/services/userServices';
import { AngryIcon, HaHaIcon, LikeIcon, LoveIcon, SadIcon, WowIcon } from '~/components/Icons';

const ChatPopup = ({ index, friend }) => {
    const { ref: chatPopupRef, isComponentVisible: isFocus, setIsComponentVisible: setIsFocus } = useClickOutside(true);
    const userInfo = useSelector(userInfoSelector);
    const notificationsMessenger = useSelector(notificationsMessengerSelector);
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

    const handleCloseChatPopup = useCallback(() => {
        dispatch(actions.closeChat(friend?.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friend?.id]);

    const handleSendMessage = async () => {
        try {
            if (!sendMessage.trim()) return;

            const clone = sendMessage.trim();
            setMessages((prev) => [
                ...prev,
                {
                    id: null,
                    sender: userInfo?.id,
                    receiver: friend?.id,
                    message: clone,
                    createdAt: new Date().toISOString(),
                },
            ]);
            setSendMessage('');
            setProcessingMessage('Đang xử lý');
            const res = await sendMessageWithFriendService({ friendId: friend?.id, message: clone });
            setMessages((prev) => {
                const index = findIndex(prev, { id: null, message: clone });

                if (index === -1) return prev;

                const updatedMessages = cloneDeep(prev);
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
        const handleNewMessage = ({ newMessage }) => {
            if (newMessage?.receiver === userInfo?.id && newMessage?.sender === friend?.id) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: newMessage?.id,
                        sender: newMessage?.sender,
                        receiver: newMessage?.receiver,
                        message: newMessage?.message,
                        picture: newMessage?.picture,
                        createdAt: newMessage?.createdAt,
                    },
                ]);
            }
        };

        const handleSendMessageFile = ({ messageFile }) => {
            if (messageFile?.receiver === friend?.id && messageFile?.sender === userInfo?.id) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: messageFile?.id,
                        sender: messageFile?.sender,
                        receiver: messageFile?.receiver,
                        message: messageFile?.message,
                        picture: messageFile?.picture,
                        createdAt: messageFile?.createdAt,
                    },
                ]);
            }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('sendMessageFile', handleSendMessageFile);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('sendMessageFile', handleSendMessageFile);
        };
    }, [userInfo?.id, friend?.id]);

    useEffect(() => {
        const notificationId = notificationsMessenger?.find((noti) => noti?.senderId === friend?.id)?.id;
        if (isFocus && notificationId) {
            (async () => {
                try {
                    await readNotificationService(notificationId);
                    dispatch(actions.readMessage(notificationId));
                } catch (error) {
                    console.log(error);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocus, friend?.id]);

    useEffect(() => {
        window.onkeydown = (e) => {
            if (isFocus && e.key === 'Escape') {
                handleCloseChatPopup();
            }
        };
    }, [handleCloseChatPopup, isFocus]);

    const [showSetting, setShowSetting] = useState(false);
    const handleShowSetting = () => setShowSetting(true);

    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        socket.emit('checkFriendOnline', friend?.id);

        const handleIsFriendOnline = (isFriendOnline) => {
            setIsOnline(isFriendOnline);
        };

        socket.on('isFriendOnline', handleIsFriendOnline);

        return () => {
            socket.off('isFriendOnline', handleIsFriendOnline);
        };
    }, [friend?.id]);

    const handleStartCallAudio = () => {
        socket.emit('requestPrivateCall', { callerId: userInfo?.id, receiverId: friend?.id });
    };

    const handleChooseFile = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const imagesUrl = [];
            if (files.length > 0) {
                const uploadedUrls = await Promise.all(files.map((fileUpload) => uploadToCloudinary(fileUpload)));
                imagesUrl.push(...uploadedUrls);
            }

            imagesUrl?.map(async (imageUrl) => {
                await sendMessageWithFriendService({ friendId: friend?.id, file: imageUrl });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleEmotionMessage = async ({ messageId, emotionType }) => {
        try {
            await emotionMessageService({ messageId, emotionType });
        } catch (error) {
            console.log(error);
        }
    };

    const [currentMessageExpandId, setCurrentMessageExpandId] = useState(null);

    const expandEmotionListRef = useRef([]);
    const {
        ref: emotionListRef,
        isComponentVisible: showEmotionList,
        setIsComponentVisible: setShowEmotionList,
    } = useClickOutside(false, expandEmotionListRef);

    const [positionOfEmotionList, setPositionOfEmotionList] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        setShowEmotionList(false);
    }, [currentMessageExpandId]);

    const handleShowEmotionList = (e, messageId) => {
        setCurrentMessageExpandId(messageId);
        setShowEmotionList(true);
        setPositionOfEmotionList({
            x: e.clientX,
            y: e.clientY,
        });
    };

    return (
        <div
            style={{ right: index === 0 ? '3rem' : '38rem', zIndex: 2 - index }}
            className={clsx(styles['chat-wrapper'])}
            ref={chatPopupRef}
            onClick={() => setIsFocus(true)}
        >
            <div
                className={clsx(styles['chat-header'], {
                    [[styles['is-focus']]]: isFocus,
                })}
            >
                <div className={clsx(styles['chat-receiver'])}>
                    <div
                        className={clsx(styles['avatar'], {
                            [[styles['is-online']]]: isOnline,
                        })}
                    >
                        <img src={friend?.avatar || defaultAvatar} />
                    </div>
                    {friend?.lastName && friend?.firstName && (
                        <div className={clsx(styles['name'])}>{`${friend?.lastName} ${friend?.firstName}`}</div>
                    )}
                    <FontAwesomeIcon
                        className={clsx(styles['chat-options'])}
                        icon={faChevronDown}
                        onClick={handleShowSetting}
                    />
                    <FontAwesomeIcon
                        className={clsx(styles['chat-options'])}
                        icon={faPhone}
                        onClick={handleStartCallAudio}
                    />
                    <FontAwesomeIcon className={clsx(styles['chat-options'])} icon={faVideo} />
                </div>
                <FontAwesomeIcon
                    icon={faXmark}
                    className={clsx(styles['chat-close'])}
                    onClick={() => handleCloseChatPopup(false)}
                />
            </div>
            <div ref={endOfMessagesRef} className={clsx(styles['chat-container'])}>
                {messages?.length > 0 ? (
                    messages?.map((message, index) => {
                        let minDiff = 0;
                        let isSameDay = true;
                        const latestTime = calculateTime(message?.createdAt);
                        const beforeTime = calculateTime(new Date().toISOString());
                        if (
                            latestTime?.year !== beforeTime?.year ||
                            latestTime?.month !== beforeTime?.month ||
                            latestTime?.day !== beforeTime?.day
                        ) {
                            isSameDay = false;
                        }

                        if (index >= 1) {
                            const date1 = new Date(message?.createdAt);
                            const date2 = new Date(messages[index - 1]?.createdAt);

                            const diff = date1 - date2;
                            minDiff = diff / (1000 * 60);
                        }
                        return (
                            <div className={clsx(styles['chat-item-wrapper'])} key={`chat-${index}`}>
                                {(index === 0 || minDiff >= 10) && (
                                    <div className="fz-14 text-center mt-4 mb-2">
                                        {latestTime?.hours}:{latestTime?.minutes}{' '}
                                        {!isSameDay && `${latestTime?.day}/${latestTime?.month}`}
                                    </div>
                                )}
                                <div className={clsx(styles['chat-item'])}>
                                    <div
                                        className={clsx(styles['message-wrapper'], {
                                            [[styles['message-current-user']]]: message?.sender === userInfo?.id,
                                        })}
                                    >
                                        {(index === 0 ||
                                            minDiff >= 10 ||
                                            messages[index - 1]?.sender !== message?.sender) &&
                                            message?.sender === friend?.id && (
                                                <img
                                                    className={clsx(styles['message-avatar'])}
                                                    src={friend?.avatar || defaultAvatar}
                                                />
                                            )}
                                        {message?.message && (
                                            <div className={clsx(styles['message'])}>{message?.message}</div>
                                        )}
                                        {message?.picture && (
                                            <img src={message?.picture} className={clsx(styles['message-picture'])} />
                                        )}
                                        {message.symbol && (
                                            <div>
                                                {message.symbol === 'like' && (
                                                    <FontAwesomeIcon
                                                        className={clsx(styles['message-symbol'])}
                                                        icon={faThumbsUp}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {processingMessage &&
                                            findLast(messages, { sender: userInfo?.id }) &&
                                            isEqual(findLast(messages, { sender: userInfo?.id }), message) && (
                                                <div className={clsx(styles['process-message'])}>
                                                    {processingMessage}
                                                </div>
                                            )}
                                        <div
                                            ref={(el) => (expandEmotionListRef.current[index] = el)}
                                            className={clsx(styles['message-expand'])}
                                            onClick={(e) => handleShowEmotionList(e, message?.id)}
                                        >
                                            <svg
                                                viewBox="0 0 20 20"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                                                style={{ color: '#65676b' }}
                                            >
                                                <path
                                                    d="M6.062 11.548c.596 1.376 2.234 2.453 3.955 2.452 1.694 0 3.327-1.08 3.921-2.452a.75.75 0 1 0-1.376-.596c-.357.825-1.451 1.548-2.545 1.548-1.123 0-2.22-.72-2.579-1.548a.75.75 0 1 0-1.376.596z"
                                                    fillRule="nonzero"
                                                ></path>
                                                <ellipse cx="13.6" cy="6.8" rx="1.2" ry="1.2"></ellipse>
                                                <ellipse cx="6.4" cy="6.8" rx="1.2" ry="1.2"></ellipse>
                                                <ellipse
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    fill="none"
                                                    cx="10"
                                                    cy="10"
                                                    rx="9"
                                                    ry="9"
                                                ></ellipse>
                                            </svg>
                                        </div>
                                    </div>
                                    {index === messages?.length - 1 && (
                                        <div
                                            className={clsx(styles['time-of-last-message'], {
                                                [[styles['message-of-friend']]]: message?.sender === friend?.id,
                                            })}
                                        >
                                            {latestTime?.hours}:{latestTime?.minutes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="mt-5 text-center fz-16">
                        Hãy bắt đầu cuộc trò chuyện với {`${friend?.lastName} ${friend?.firstName}`}
                    </div>
                )}
                <div></div>
            </div>
            <ul
                ref={emotionListRef}
                style={{ top: `${positionOfEmotionList?.y}px`, left: `${positionOfEmotionList?.x}px` }}
                className={clsx(styles['emotion-list'], {
                    [[styles['show']]]: showEmotionList,
                })}
            >
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'like',
                        })
                    }
                >
                    <LikeIcon width={20} height={20} />
                </li>
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'love',
                        })
                    }
                >
                    <LoveIcon width={20} height={20} />
                </li>
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'haha',
                        })
                    }
                >
                    <HaHaIcon width={20} height={20} />
                </li>
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'wow',
                        })
                    }
                >
                    <WowIcon width={20} height={20} />
                </li>
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'sad',
                        })
                    }
                >
                    <SadIcon width={20} height={20} />
                </li>
                <li
                    className={clsx(styles['emotion'])}
                    onClick={() =>
                        handleEmotionMessage({
                            emotionType: 'angry',
                        })
                    }
                >
                    <AngryIcon width={20} height={20} />
                </li>
            </ul>
            <div className={clsx(styles['chat-footer'])}>
                <div className={clsx(styles['send-message-wrapper'])}>
                    <label htmlFor="chatpopup-attachment">
                        <FontAwesomeIcon className={clsx(styles['send-message-attachment'])} icon={faPaperclip} />
                    </label>
                    <input type="file" id="chatpopup-attachment" multiple hidden onChange={handleChooseFile} />
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
