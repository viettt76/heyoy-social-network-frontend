import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCakeCandles, faGraduationCap, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './UserProfileViewer.module.scss';
import Post from '~/components/Post';
import logo from '~/assets/imgs/logo.png';
import { useEffect, useState } from 'react';
import { getMyPostService } from '~/services/postServices';
import { getUserInfoService } from '~/services/userServices';
import WritePost from '~/components/WritePost';
import socket from '~/socket';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { calculateTime } from '~/utils/commonUtils';
import { useParams } from 'react-router-dom';

const UserProfileViewer = () => {
    const { userId } = useParams();

    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getUserInfoService(userId);
                setUserInfo(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserInfo();
    }, [userId]);

    const [myPosts, setMyPosts] = useState([]);

    const [birthdayDisplay, setBirthdayDisplay] = useState(null);

    useEffect(() => {
        setBirthdayDisplay(userInfo?.birthday ? calculateTime(new Date(userInfo?.birthday).toISOString()) : '');
    }, [userInfo?.birthday]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                if (userInfo?.id) {
                    const res = await getMyPostService(userInfo?.id);
                    setMyPosts(res);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchMyPosts();
    }, [userInfo?.id]);

    // useEffect(() => {
    //     const handleNewPost = (newPost) => {
    //         setMyPosts((prev) => [{ ...newPost, currentEmotionId: null, currentEmotionName: null }, ...prev]);
    //     };
    //     socket.on('myNewPost', handleNewPost);

    //     return () => {
    //         socket.off('myNewPost', handleNewPost);
    //     };
    // }, []);

    return (
        <div className={clsx('container', styles['profile-wrapper'])}>
            <div className={clsx(styles['header'])}>
                <div className={clsx(styles['header-left'])}>
                    <img className={clsx(styles['avatar'])} src={userInfo?.avatar || defaultAvatar} />
                    <div>
                        <h3 className={clsx(styles['full-name'])}>{`${userInfo?.lastName} ${userInfo?.firstName}`}</h3>
                        <div className={clsx(styles['number-of-friends'])}>207 bạn bè</div>
                    </div>
                </div>
            </div>
            <div className={clsx('row', styles['container'])}>
                <div className={clsx('col-5', styles['sidebar'])}>
                    <div className={clsx(styles['sidebar-item'])}>
                        <h6 className={clsx(styles['sidebar-item-title'])}>Giới thiệu</h6>
                        <div className={clsx(styles['sidebar-item-content'], styles['introduction'])}>
                            {userInfo?.birthday && (
                                <div className={clsx(styles['sidebar-item-content-item'])}>
                                    <FontAwesomeIcon
                                        icon={faCakeCandles}
                                        className={clsx(styles['sidebar-item-content-item-icon'])}
                                    />
                                    Ngày sinh:{' '}
                                    {`${birthdayDisplay?.day}/${birthdayDisplay?.month}/${birthdayDisplay?.year}`}
                                </div>
                            )}
                            {userInfo?.homeTown && (
                                <div className={clsx(styles['sidebar-item-content-item'])}>
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className={clsx(styles['sidebar-item-content-item-icon'])}
                                    />
                                    Quê quán: {userInfo?.homeTown}
                                </div>
                            )}
                            {userInfo?.school && (
                                <div className={clsx(styles['sidebar-item-content-item'])}>
                                    <FontAwesomeIcon
                                        icon={faGraduationCap}
                                        className={clsx(styles['sidebar-item-content-item-icon'])}
                                    />
                                    Trường học: {userInfo?.school}
                                </div>
                            )}
                            {userInfo?.workplace && (
                                <div className={clsx(styles['sidebar-item-content-item'])}>
                                    <FontAwesomeIcon
                                        icon={faBuilding}
                                        className={clsx(styles['sidebar-item-content-item-icon'])}
                                    />
                                    Nơi làm việc: {userInfo?.workplace}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={clsx(styles['sidebar-item'])}>
                        <div className="d-flex align-items-center justify-content-between">
                            <h6 className={clsx(styles['sidebar-item-title'])}>Ảnh</h6>
                            <div className={clsx(styles['see-all-imgs'])}>Xem tất cả ảnh</div>
                        </div>
                        <div className={clsx(styles['sidebar-item-content'])}>
                            <div className={clsx(styles['picture-wrapper'])}>
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                                <img src={logo} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={clsx('col-7')}>
                    <WritePost />
                    {myPosts?.map((post) => (
                        <Post key={`post-${post?.id}`} postInfo={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfileViewer;
