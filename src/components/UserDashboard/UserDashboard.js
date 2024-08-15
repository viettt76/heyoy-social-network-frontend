import clsx from 'clsx';
import styles from './UserDashboard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { logoutService } from '~/services/userServices';
import { useEffect } from 'react';

const UserDashboard = ({ userDashboardRef, showUserDashboard }) => {
    const navigate = useNavigate(null);

    useEffect(() => {
        // navigate('/login');
    }, []);

    const handleLogout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.log(error);
        } finally {
            navigate('/profile');
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
