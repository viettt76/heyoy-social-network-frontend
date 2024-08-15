import clsx from 'clsx';
import { useState } from 'react';
import _ from 'lodash';
import logo from '~/assets/imgs/logo.png';
import styles from './FriendsList.module.scss';
import ChatPopup from '~/components/ChatPopup';

const FriendsList = () => {
    const [chatList, setChatList] = useState([]);

    const friendsList = [
        {
            id: '01',
            avatar: logo,
            name: 'Hoàng Việt',
        },
        {
            id: '03',
            avatar: logo,
            name: 'Vũ',
        },
        {
            id: '9',
            avatar: logo,
            name: 'Huyền',
        },
        {
            id: '015',
            avatar: logo,
            name: 'Văn',
        },
    ];

    const addToChatList = (friend) => {
        const i = _.findIndex(chatList, {
            id: friend?.id,
            avatar: friend?.avatar,
            name: friend?.name,
        });
        if (i !== -1) {
            _.pullAt(chatList, [i]);
        }
        const cloneChatList = [...chatList];
        cloneChatList.unshift({
            id: friend?.id,
            avatar: friend?.avatar,
            name: friend?.name,
        });
        setChatList(cloneChatList);
    };

    return (
        <div>
            <ul className={clsx(styles['friends-list-wrapper'])}>
                {friendsList?.map((friend, index) => {
                    return (
                        <li
                            key={`friend-${index}`}
                            className={clsx(styles['friend'])}
                            onClick={() => addToChatList(friend)}
                        >
                            <img className={clsx(styles['friend-avatar'])} src={friend?.avatar} />
                            <div className={clsx(styles['friend-name'])}>{friend?.name}</div>
                        </li>
                    );
                })}
            </ul>
            {/* <ChatPopup /> */}
        </div>
    );
};

export default FriendsList;
