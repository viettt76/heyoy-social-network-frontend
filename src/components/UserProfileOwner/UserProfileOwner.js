import clsx from 'clsx';
import styles from './UserProfileOwner.module.scss';
import UserProfileOwnerHeader from './UserProfileOwnerHeader';
import { useState } from 'react';
import UserProfileViewer from '~/components/UserProfileViewer';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import UserProfileOwnerPost from './UserProfileOwnerPost';
import UserProfilePhotos from '~/components/UserProfilePhotos';

const UserProfileOwner = () => {
    const userInfo = useSelector(userInfoSelector);

    const [viewMode, setViewMode] = useState(false);

    const handleOnViewMode = () => setViewMode(true);
    const handleOffViewMode = () => setViewMode(false);

    return (
        <>
            {viewMode ? (
                <>
                    <div className={clsx(styles['view-mode-wrapper'])}>
                        <div className={clsx(styles['view-mode-text'])}>Đang trong chế độ xem của người khác</div>
                        <div className={clsx(styles['view-mode-btn'])} onClick={handleOffViewMode}>
                            Thoát
                        </div>
                    </div>
                    <div className={clsx(styles['user-profile-viewer-view-mode'])}>
                        <UserProfileViewer />
                    </div>
                </>
            ) : (
                <>
                    <div className={clsx('container', styles['profile-wrapper'])}>
                        <UserProfileOwnerHeader handleOnViewMode={handleOnViewMode} />
                    </div>
                    <Routes>
                        <Route path="" element={<UserProfileOwnerPost />} />
                        <Route
                            path="photos"
                            element={userInfo?.id ? <UserProfilePhotos userId={userInfo?.id} /> : <></>}
                        />
                    </Routes>
                </>
            )}
        </>
    );
};

export default UserProfileOwner;
