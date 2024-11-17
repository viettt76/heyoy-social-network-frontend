import clsx from 'clsx';
import styles from './SidebarGroups.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const SidebarGroups = () => {
    const location = useLocation();

    return (
        <>
            <label className={clsx(styles['btn-show__mobile-label'])} htmlFor="checkbox-show-sidebar-group">
                <FontAwesomeIcon className={clsx(styles['btn-show__mobile-icon'])} icon={faBars} />
            </label>
            <input
                className={clsx(styles['btn-show__mobile-checkbox'])}
                type="checkbox"
                id="checkbox-show-sidebar-group"
            />
            <div className={clsx(styles['sidebar-wrapper'])}>
                <div className={clsx(styles['sidebar-title'])}>Nhóm</div>
                <Link
                    to="/groups/joins"
                    className={clsx(styles['sidebar-item'], {
                        [[styles['active']]]: location.pathname === '/groups/joins',
                    })}
                >
                    Nhóm của bạn
                </Link>
                <Link
                    to="/groups/discover"
                    className={clsx(styles['sidebar-item'], {
                        [[styles['active']]]: location.pathname === '/groups/discover',
                    })}
                >
                    Khám phá
                </Link>
                <Link
                    to="/groups/search"
                    className={clsx(styles['sidebar-item'], {
                        [[styles['active']]]: location.pathname === '/groups/search',
                    })}
                >
                    Tìm kiếm
                </Link>
            </div>
        </>
    );
};

export default SidebarGroups;
