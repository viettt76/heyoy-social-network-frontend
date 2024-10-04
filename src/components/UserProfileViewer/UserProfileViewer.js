import clsx from 'clsx';
import styles from './UserProfileViewer.module.scss';
import UserProfileViewerHeader from './UserProfileViewerHeader';
import { Route, Routes, useParams } from 'react-router-dom';
import UserProfileViewerPost from './UserProfileViewerPost';
import UserProfilePhotos from '~/components/UserProfilePhotos';

const UserProfileViewer = () => {
    const { userId } = useParams();

    return (
        <>
            <div className={clsx('container', styles['profile-wrapper'])}>
                <UserProfileViewerHeader />
            </div>
            <Routes>
                <Route path="" element={<UserProfileViewerPost />} />
                <Route path="photos" element={userId ? <UserProfilePhotos userId={userId} /> : <></>} />
            </Routes>
        </>
    );
};

export default UserProfileViewer;
