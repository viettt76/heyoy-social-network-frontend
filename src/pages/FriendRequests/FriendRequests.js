import Friend from '~/components/Friend';
import clsx from 'clsx';
import styles from './FriendRequests.module.scss';
import { useEffect, useState } from 'react';
import { acceptFriendshipService, getFriendRequestService } from '~/services/relationshipServices';
import _ from 'lodash';

const FriendRequests = () => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequest = async () => {
            try {
                const res = await getFriendRequestService();
                setFriendRequests(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchFriendRequest();
    }, []);

    const handleAcceptFriendship = async (id) => {
        try {
            await acceptFriendshipService(id);
            setFriendRequests((prev) => {
                const frs = _.filter(prev, (f) => f.id !== id);
                return frs;
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {friendRequests?.length === 0 ? (
                <div className="mt-3 w-100 text-center fz-16">
                    <div>Bạn không có lời mời kết bạn</div>
                </div>
            ) : (
                <div className={clsx(styles['friends-wrapper'])}>
                    {friendRequests?.map((request) => (
                        <Friend
                            key={`request-${request?.id}`}
                            type="friend-request"
                            id={request?.id}
                            firstName={request?.firstName}
                            lastName={request?.lastName}
                            numberOfCommonFriends={request?.numberOfCommonFriends}
                            handleAcceptFriendship={handleAcceptFriendship}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default FriendRequests;
