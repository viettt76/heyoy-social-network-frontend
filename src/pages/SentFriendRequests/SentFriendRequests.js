import Friend from '~/components/Friend';
import clsx from 'clsx';
import styles from './SentFriendRequests.module.scss';
import { useEffect, useState } from 'react';
import { getSentFriendRequestsService, cancelFriendRequestService } from '~/services/relationshipServices';
import _ from 'lodash';

const SentFriendRequests = () => {
    const [sentFriendRequests, setSentFriendRequests] = useState([]);

    useEffect(() => {
        const fetchSentFriendRequests = async () => {
            try {
                const res = await getSentFriendRequestsService();
                setSentFriendRequests(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSentFriendRequests();
    }, []);

    const handleCancelFriendRequest = async (receiverId) => {
        try {
            await cancelFriendRequestService(receiverId);
            setSentFriendRequests((prev) => {
                const frs = _.filter(prev, (f) => f.id !== receiverId);
                return frs;
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {sentFriendRequests?.length === 0 ? (
                <div className="mt-3 w-100 text-center fz-16">
                    <div>Bạn chưa gửi lời mời kết bạn nào</div>
                </div>
            ) : (
                <div className={clsx(styles['friends-wrapper'])}>
                    {sentFriendRequests?.map((request) => (
                        <Friend
                            key={`request-${request?.id}`}
                            type="sent-friend-request"
                            id={request?.id}
                            firstName={request?.firstName}
                            lastName={request?.lastName}
                            numberOfCommonFriends={request?.numberOfCommonFriends}
                            handleCancelFriendRequest={handleCancelFriendRequest}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default SentFriendRequests;
