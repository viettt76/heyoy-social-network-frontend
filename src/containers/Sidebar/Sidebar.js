import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import styles from './Sidebar.module.scss';
import { userInfoSelector } from '~/redux/selectors';

const Sidebar = () => {
    const userInfo = useSelector(userInfoSelector);

    return (
        <div>
            <ul className={clsx(styles['sidebar-features'])}>
                <li>
                    <Link to="/profile" className={clsx(styles['sidebar-feature'])}>
                        <img
                            className={clsx(styles['sidebar-feature-avatar'], styles['sidebar-feature-icon'])}
                            src={userInfo.avatar ? '' : defaultAvatar}
                        />
                        <div className={clsx(styles['sidebar-feature-label'])}>
                            {userInfo.lastName} {userInfo.firstName}
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to="/friends" className={clsx(styles['sidebar-feature'])}>
                        <FontAwesomeIcon icon={faUserGroup} className={clsx(styles['sidebar-feature-icon'])} />
                        <div className={clsx(styles['sidebar-feature-label'])}>Bạn bè</div>
                    </Link>
                </li>
                <li>
                    <Link className={clsx(styles['sidebar-feature'])}>
                        <FontAwesomeIcon icon={faUsers} className={clsx(styles['sidebar-feature-icon'])} />
                        <div className={clsx(styles['sidebar-feature-label'])}>Nhóm</div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
