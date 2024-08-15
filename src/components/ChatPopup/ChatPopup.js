import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ChatPopup.module.scss';
import logo from '~/assets/imgs/logo.png';

const ChatPopup = () => {
    const currentUser = {
        avatar: logo,
        id: '1',
    };

    const receiverUser = {
        avatar: logo,
        id: '2',
    };

    const endOfMessagesRef = useRef(null);

    const [sendMessage, setSendMessage] = useState('');
    const [showChatPopup, setShowChatPopup] = useState(false);

    const chatList = [
        { sender: '1', receiver: '2', content: 'hello', time: 'thứ 2' },
        { sender: '1', receiver: '2', content: 'bạn', time: 'thứ 2' },
        { sender: '1', receiver: '2', content: 'khoẻ không', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'mình', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'khoẻ', time: 'thứ 2' },
        { sender: '1', receiver: '2', content: 'ok', time: 'thứ 2' },
        { sender: '1', receiver: '2', content: 'bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye bye bye bye bye bye bye bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'bye bye', time: 'thứ 2' },
        { sender: '2', receiver: '1', content: 'ngủ ngon', time: 'thứ 2' },
    ];

    useEffect(() => {
        endOfMessagesRef.current.scrollTop = endOfMessagesRef.current.scrollHeight;
    }, [chatList]);

    return (
        <div
            className={clsx(styles['chat-wrapper'], {
                [styles['show']]: showChatPopup,
            })}
        >
            <div className={clsx(styles['chat-header'])}>
                <div className={clsx(styles['chat-receiver'])}>Quốc Việt</div>
                <FontAwesomeIcon
                    icon={faXmark}
                    className={clsx(styles['chat-close'])}
                    onClick={() => setShowChatPopup(false)}
                />
            </div>
            <div ref={endOfMessagesRef} className={clsx(styles['chat-container'])}>
                {chatList?.map((chat, index) => {
                    return (
                        <div
                            key={`chat-${index}`}
                            className={clsx(styles['message-wrapper'], {
                                [[styles['message-current-user']]]: chat?.sender === currentUser?.id,
                            })}
                        >
                            {index === 0 ||
                                (chatList[index - 1]?.sender !== chatList[index]?.sender &&
                                    chat?.sender === receiverUser?.id && (
                                        <img className={clsx(styles['message-avatar'])} src={receiverUser?.avatar} />
                                    ))}
                            <div className={clsx(styles['message'])}>{chat?.content}</div>
                        </div>
                    );
                })}
                <div></div>
            </div>
            <div className={clsx(styles['chat-footer'])}>
                <div className={clsx(styles['send-message-wrapper'])}>
                    <input
                        className={clsx(styles['send-message'])}
                        placeholder="Aa"
                        onChange={(e) => setSendMessage(e.target.value)}
                    />
                    {sendMessage ? (
                        <i className={clsx(styles['send-message-btn'])}></i>
                    ) : (
                        <FontAwesomeIcon className={clsx(styles['link-icon'])} icon={faThumbsUp} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
