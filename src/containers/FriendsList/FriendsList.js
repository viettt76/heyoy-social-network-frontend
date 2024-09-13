import clsx from 'clsx';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import styles from './FriendsList.module.scss';
import ChatPopup from '~/components/ChatPopup';
import socket from '~/socket';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import * as actions from '~/redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { openChatsSelector } from '~/redux/selectors';

const FriendsList = () => {
    const dispatch = useDispatch();

    const openChats = useSelector(openChatsSelector);

    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        socket.on('friendsOnline', (resOnlineFriends) => {
            setOnlineFriends(resOnlineFriends);
        });
    }, []);

    const addToChatList = (friend) => {
        dispatch(actions.openChat(friend));
    };

    return (
        <div>
            <ul className={clsx(styles['friends-list-wrapper'])}>
                {onlineFriends?.map((friend, index) => {
                    return (
                        <li
                            key={`friend-${index}`}
                            className={clsx(styles['friend'])}
                            onClick={() => addToChatList(friend)}
                        >
                            <div className={clsx(styles['friend-avatar'])}>
                                <img src={friend?.avatar || defaultAvatar} />
                            </div>
                            <div
                                className={clsx(styles['friend-name'])}
                            >{`${friend?.lastName} ${friend?.firstName}`}</div>
                        </li>
                    );
                })}
            </ul>
            {openChats?.map((friend, index) => {
                return <ChatPopup key={`chat-${index}`} friend={friend} />;
            })}
        </div>
    );
};

export default FriendsList;
