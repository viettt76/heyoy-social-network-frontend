import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPencil } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Profile.module.scss';
import Post from '~/components/Post';
import logo from '~/assets/imgs/logo.png';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import { useEffect, useState } from 'react';
import { getMyPostService } from '~/services/postServices';

const Profile = () => {
    const userInfo = useSelector(userInfoSelector);
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const res = await getMyPostService();
                setMyPosts(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMyPosts();
    }, []);

    return (
        <div className={clsx('container', styles['profile-wrapper'])}>
            <div className={clsx(styles['header'])}>
                <div className={clsx(styles['header-left'])}>
                    <img className={clsx(styles['avatar'])} src={logo} />
                    <div>
                        <h3 className={clsx(styles['full-name'])}>{`${userInfo.lastName} ${userInfo.firstName}`}</h3>
                        <div className={clsx(styles['number-of-friends'])}>207 bạn bè</div>
                    </div>
                </div>
                <div className={clsx(styles['header-right'])}>
                    <div className={clsx(styles['edit-profile-btn'])}>
                        <FontAwesomeIcon icon={faPencil} />
                        <span>Chỉnh sửa trang cá nhân</span>
                    </div>
                    <div className={clsx(styles['header-right-menu'])}>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </div>
                </div>
            </div>
            <div className={clsx('row', styles['container'])}>
                <div className={clsx('col-5', styles['sidebar'])}>
                    <div className={clsx(styles['sidebar-item'])}>
                        <h6 className={clsx(styles['sidebar-item-title'])}>Giới thiệu</h6>
                        <div className={clsx(styles['sidebar-item-content'], styles['introduction'])}>
                            {userInfo.homeTown && <div>Quê quán: Hà Nội</div>}
                            {userInfo.favorite && <div>Sở thích: Chơi game</div>}
                            <button className={clsx(styles['btn-add-intro'])}>Thêm thông tin giới thiệu</button>
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
                    {myPosts?.map((post) => (
                        <Post key={`post-${post?.id}`} postInfo={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
