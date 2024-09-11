import clsx from 'clsx';
import Friend from '~/components/Friend';
import styles from './MyFriends.module.scss';
import { useEffect, useState } from 'react';
import { allFriendsService } from '~/services/relationshipServices';
import { Link } from 'react-router-dom';

const Friends = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchAllFriends = async () => {
            try {
                const res = await allFriendsService();
                setFriends(res);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllFriends();
    }, []);
    return (
        <>
            {friends?.length === 0 ? (
                <div className="mt-3 w-100 text-center fz-16">
                    <div>Bạn chưa có bạn bè</div>
                    <Link to="/friends/suggestions">Hãy kết bạn thêm nào</Link>
                </div>
            ) : (
                <div className={clsx(styles['friends-wrapper'])}>
                    {friends?.map((friend) => (
                        <Friend
                            key={`friend-${friend?.id}`}
                            type="friend"
                            id={friend?.id}
                            firstName={friend?.firstName}
                            lastName={friend?.lastName}
                            numberOfCommonFriends={friend?.numberOfCommonFriends}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default Friends;
