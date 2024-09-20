import clsx from 'clsx';
import styles from './UserDashboard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { logoutService } from '~/services/authServices';
import { useDispatch } from 'react-redux';
import * as actions from '~/redux/actions';
import socket from '~/socket';

const UserDashboard = ({ userDashboardRef, showUserDashboard }) => {
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
        <ul
            ref={userDashboardRef}
            className={clsx(styles['dashboard-wrapper'], {
                [[styles['show']]]: showUserDashboard,
            })}
        >
            <li className={clsx(styles['dashboard-item'])}>
                <Link className={clsx(styles['dashboard-link'])} to="/profile">
                    Trang cá nhân
                </Link>
            </li>
            <li className={clsx(styles['dashboard-item'])}>
                <Link className={clsx(styles['dashboard-link'])}>Cài đặt</Link>
            </li>
            <li className={clsx(styles['dashboard-item'])}>
                <div className={clsx(styles['dashboard-link'])} onClick={handleLogout}>
                    Đăng xuất
                </div>
            </li>
        </ul>
    );
};

export default UserDashboard;
