import clsx from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHouse, faPlus, faRightFromBracket, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { useDispatch } from 'react-redux';
import { logoutService } from '~/services/authServices';
import * as actions from '~/redux/actions';
import socket from '~/socket';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(actions.clearUserInfo());
            localStorage.removeItem('isAuthenticated');
            await logoutService();
            socket.disconnect();
        } catch (error) {
            console.log(error);
        } finally {
            navigate('/login');
        }
    };

    return (
        <div className={clsx(styles['min-h-100vh'])}>
            <div className={clsx(styles['sidebar-wrapper'])}>
                <div className={clsx(styles['logo'])}>
                    <span>Heyoy</span>
                </div>
                <ul className={clsx(styles['sidebar-group'])}>
                    <li>
                        <Link
                            to="/"
                            className={clsx(styles['sidebar-feature'], {
                                [[styles['active']]]: location.pathname === '/',
                            })}
                        >
                            <FontAwesomeIcon icon={faHouse} className={clsx(styles['sidebar-feature-icon'])} />
                            <div className={clsx(styles['sidebar-feature-label'])}>Feed</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/friends" className={clsx(styles['sidebar-feature'])}>
                            <FontAwesomeIcon icon={faUserGroup} className={clsx(styles['sidebar-feature-icon'])} />
                            <div className={clsx(styles['sidebar-feature-label'])}>Bạn bè</div>
                        </Link>
                    </li>
                </ul>
                <ul className={clsx(styles['sidebar-group'])}>
                    <li>
                        <Link to="/" className={clsx(styles['sidebar-feature'])}>
                            <FontAwesomeIcon icon={faPlus} className={clsx(styles['sidebar-feature-icon'])} />
                            <div className={clsx(styles['sidebar-feature-label'])}>Messages</div>
                        </Link>
                    </li>
                </ul>
                <ul className={clsx(styles['sidebar-group'], styles['account-dashboard'])}>
                    <li>
                        <Link to="/" className={clsx(styles['sidebar-feature'])}>
                            <FontAwesomeIcon icon={faGear} className={clsx(styles['sidebar-feature-icon'])} />
                            <div className={clsx(styles['sidebar-feature-label'])}>Settings</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className={clsx(styles['sidebar-feature'])}>
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                className={clsx(styles['sidebar-feature-icon'])}
                            />
                            <div className={clsx(styles['sidebar-feature-label'])} onClick={handleLogout}>
                                Đăng xuất
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
