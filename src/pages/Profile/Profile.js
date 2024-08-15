import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Profile.module.scss';
import Post from '~/components/Post';
import logo from '~/assets/imgs/logo.png';

const Profile = () => {
    return (
        <div className={clsx('container', styles['profile-wrapper'])}>
            <div className={clsx(styles['header'])}>
                <div className={clsx(styles['header-left'])}>
                    <img className={clsx(styles['avatar'])} src={logo} />
                    <div>
                        <h3 className={clsx(styles['full-name'])}>Hoàng Việt</h3>
                        <div className={clsx(styles['number-of-friends'])}>207 bạn bè</div>
                    </div>
                </div>
                <div className={clsx(styles['header-right'])}>
                    <div className={clsx(styles['edit-profile-btn'])}>
                        <FontAwesomeIcon icon={faPencil} />
                        <span>Chỉnh sửa trang cá nhân</span>
                    </div>
                </div>
            </div>
            <div className={clsx('row', styles['container'])}>
                <div className={clsx('col-5', styles['sidebar'])}>
                    <div className={clsx(styles['sidebar-item'])}>
                        <h6 className={clsx(styles['sidebar-item-title'])}>Giới thiệu</h6>
                        <div className={clsx(styles['sidebar-item-content'], styles['introduction'])}>
                            <div>Quê quán: Hà Nội</div>
                            <div>Sở thích: Chơi game</div>
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
                    <Post />
                </div>
            </div>
        </div>
    );
};

export default Profile;
