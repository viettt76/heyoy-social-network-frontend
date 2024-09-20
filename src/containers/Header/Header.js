import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBell, faMessage } from '@fortawesome/free-regular-svg-icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Header.module.scss';
import logo from '~/assets/imgs/logo.png';
import useClickOutside from '~/hook/useClickOutside';
import Messenger from '~/components/Messenger';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';

const Header = () => {
    const userInfo = useSelector(userInfoSelector);

    const messengerIconRef = useRef(null);
    const {
        ref: messengerRef,
        isComponentVisible: showMessenger,
        setIsComponentVisible: setShowMessenger,
    } = useClickOutside(false, messengerIconRef);

    return (
        <div className={clsx('d-flex justify-content-between', styles['header'])}>
            <div className="d-flex">
                <Link to="/">
                    <img className={clsx(styles['logo'])} src={logo} />
                </Link>
                <div className={clsx('d-flex align-items-center', styles['search-wrapper'])}>
                    <FontAwesomeIcon className={clsx(styles['search-icon'])} icon={faMagnifyingGlass} />
                    <input className={clsx('fz-16 ms-3', styles['search-input'])} placeholder="Tìm kiếm trên Heyoy" />
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
                        onClick={() => setShowMessenger(!showMessenger)}
                    >
                        <FontAwesomeIcon className={clsx(styles['action-user-icon'])} icon={faMessage} />
                        <ReactTooltip id="tool-tip-message" place="bottom" content="Tin nhắn" />
                    </div>
                    <Messenger messengerRef={messengerRef} showMessenger={showMessenger} />
                </div>

                <div
                    className={clsx('d-flex justify-content-center align-items-center fz-16', styles['action-user'])}
                    data-tooltip-id="tool-tip-notification"
                >
                    <FontAwesomeIcon className={clsx(styles['action-user-icon'])} icon={faBell} />
                    <ReactTooltip className="fz-16" id="tool-tip-notification" place="bottom" content="Thông báo" />
                </div>
                <div className={clsx(styles['avatar'])}>
                    <span>
                        {userInfo?.lastName} {userInfo?.firstName}
                    </span>
                    <Link to="/profile">
                        <img src={userInfo?.avatar || defaultAvatar} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
