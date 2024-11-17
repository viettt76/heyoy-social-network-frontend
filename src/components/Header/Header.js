import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Header.module.scss';
import logo from '~/assets/imgs/logo.png';
import useClickOutside from '~/hook/useClickOutside';
import Messenger from '~/components/Messenger';
import UserDashboard from '~/components/UserDashboard';
import { BellIcon, MessengerIcon } from '~/components/Icons';
import socket from '~/socket';
import {
    getNotificationsService,
    readMenuNotificationMessengerService,
    readMenuNotificationOtherService,
    searchService,
} from '~/services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '~/redux/actions';
import { notificationsMessengerSelector, notificationsOtherSelector } from '~/redux/selectors';
import Notification from '~/components/Notification';
import useDebounce from '~/hook/useDebounce';
import defaultAvatar from '~/assets/imgs/default-avatar.png';

const Header = () => {
    const dispatch = useDispatch();
    const notificationsMessenger = useSelector(notificationsMessengerSelector);
    const notificationsOther = useSelector(notificationsOtherSelector);

    const messengerIconRef = useRef(null);
    const {
        ref: messengerRef,
        isComponentVisible: showMessenger,
        setIsComponentVisible: setShowMessenger,
    } = useClickOutside(false, messengerIconRef);

    const notificationIconRef = useRef(null);
    const {
        ref: notificationRef,
        isComponentVisible: showNotification,
        setIsComponentVisible: setShowNotification,
    } = useClickOutside(false, notificationIconRef);

    const userDashboardIconRef = useRef(null);
    const modalDeleteAccountRef = useRef(null);
    const modalChangePasswordRef = useRef(null);
    const {
        ref: userDashboardRef,
        isComponentVisible: showUserDashboard,
        setIsComponentVisible: setShowUserDashboard,
    } = useClickOutside(false, [userDashboardIconRef, modalDeleteAccountRef, modalChangePasswordRef]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getNotificationsService();
                if (res?.messenger?.length > 0) {
                    res.messenger.map((noti) => {
                        dispatch(actions.addNotificationMessenger(noti));
                    });
                }
                if (res?.other?.length > 0) {
                    res.other.map((noti) => {
                        dispatch(actions.addNotificationOther(noti));
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })();

        const handleNewNotificationMessenger = ({ notification: newNotificationMessenger }) => {
            dispatch(actions.addNotificationMessenger(newNotificationMessenger));
        };

        const handleNotificationNewFriendRequest = (notificationFriendRequest) => {
            dispatch(actions.addNotificationOther(notificationFriendRequest));
        };

        socket.on('newMessage', handleNewNotificationMessenger);
        socket.on('notificationNewFriendRequest', handleNotificationNewFriendRequest);

        return () => {
            socket.off('newMessage', handleNewNotificationMessenger);
            socket.off('notificationNewFriendRequest', handleNotificationNewFriendRequest);
        };
    }, []);

    const [searchKeyword, setSearchKeyword] = useState('');
    const searchKeywordDebounced = useDebounce(searchKeyword, 500);

    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                if (searchKeywordDebounced.trim() !== '') {
                    const res = await searchService(searchKeywordDebounced.trim());
                    setSearchResult(res);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [searchKeywordDebounced]);

    const handleShowMessenger = async () => {
        try {
            await readMenuNotificationMessengerService();
            dispatch(actions.readNotificationMessenger());
            setShowMessenger(!showMessenger);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowNotification = async () => {
        try {
            await readMenuNotificationOtherService();
            dispatch(actions.readNotificationOther());
            setShowNotification(!showNotification);
        } catch (error) {
            console.log(error);
        }
    };

    const x = () => {};

    return (
        <div className={clsx('d-flex justify-content-between', styles['header'])}>
            <div className="d-flex">
                <Link to="/">
                    <img className={clsx(styles['logo'])} src={logo} />
                </Link>
                <div className={clsx('d-flex align-items-center', styles['search-wrapper'])}>
                    <FontAwesomeIcon className={clsx(styles['search-icon'])} icon={faMagnifyingGlass} />
                    <input
                        className={clsx('fz-16 ms-3', styles['search-input'])}
                        placeholder="Tìm kiếm trên Heyoy"
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    {searchResult?.length > 0 && (
                        <div className={clsx(styles['search-result-wrapper'])}>
                            {searchResult?.map((item, index) => {
                                return (
                                    <Link
                                        to={`/profile/${item?.id}`}
                                        key={`search-result-item-${index}`}
                                        className={clsx(styles['search-result-item'])}
                                    >
                                        <img
                                            className={clsx(styles['search-result-item-image'])}
                                            src={item?.avatar || defaultAvatar}
                                        />
                                        <div className={clsx(styles[''])}>
                                            <div className={clsx(styles['search-result-item-name'])}>
                                                <b>
                                                    {item?.lastName} {item?.firstName}
                                                </b>
                                            </div>
                                            {/* <div className={clsx(styles['search-result-item-more-info'])}>Bạn bè</div> */}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="d-flex">
                <div>
                    <div
                        ref={messengerIconRef}
                        className={clsx(
                            'd-flex justify-content-center align-items-center fz-16',
                            styles['action-user'],
                        )}
                        data-tooltip-id="tool-tip-message"
                        onClick={handleShowMessenger}
                    >
                        <MessengerIcon className={clsx(styles['action-user-icon'])} />
                        {notificationsMessenger?.reduce((acc, noti) => acc + (noti?.isOpenMenu ? 0 : 1), 0) > 0 && (
                            <div className={clsx(styles['number-of-notifications'])}>
                                {notificationsMessenger?.reduce((acc, noti) => (acc + noti?.isOpenMenu ? 0 : 1), 0)}
                            </div>
                        )}
                        <ReactTooltip id="tool-tip-message" place="bottom" content="Tin nhắn" />
                    </div>
                    <Messenger
                        messengerRef={messengerRef}
                        showMessenger={showMessenger}
                        setShowMessenger={setShowMessenger}
                    />
                </div>

                <div>
                    <div
                        ref={notificationIconRef}
                        onClick={handleShowNotification}
                        className={clsx(
                            'd-flex justify-content-center align-items-center fz-16',
                            styles['action-user'],
                        )}
                        data-tooltip-id="tool-tip-notification"
                    >
                        <BellIcon className={clsx(styles['action-user-icon'])} />
                        {notificationsOther?.reduce((acc, noti) => (acc + noti?.isOpenMenu ? 0 : 1), 0) > 0 && (
                            <div className={clsx(styles['number-of-notifications'])}>
                                {notificationsOther?.reduce((acc, noti) => (acc + noti?.isOpenMenu ? 0 : 1), 0)}
                            </div>
                        )}
                        <ReactTooltip className="fz-16" id="tool-tip-notification" place="bottom" content="Thông báo" />
                    </div>
                    <Notification
                        notificationRef={notificationRef}
                        showNotification={showNotification}
                        setShowNotification={setShowNotification}
                    />
                </div>
                <div>
                    <div
                        ref={userDashboardIconRef}
                        onClick={() => setShowUserDashboard(!showUserDashboard)}
                        className={clsx(
                            'position-relative d-flex justify-content-center align-items-center fz-16',
                            styles['action-user'],
                        )}
                        data-tooltip-id="tool-tip-account"
                    >
                        <FontAwesomeIcon className={clsx(styles['action-user-icon'])} icon={faUser} />
                        <ReactTooltip
                            className="fz-16"
                            id="tool-tip-account"
                            place="bottom-start"
                            content="Tài khoản"
                        />
                    </div>
                    <UserDashboard
                        userDashboardRef={userDashboardRef}
                        showUserDashboard={showUserDashboard}
                        setShowUserDashboard={setShowUserDashboard}
                        modalDeleteAccountRef={modalDeleteAccountRef}
                        modalChangePasswordRef={modalChangePasswordRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
