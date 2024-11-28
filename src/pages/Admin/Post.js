import clsx from 'clsx';
import styles from './ManagePost.module.scss';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmerica } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { approvePostService, denyPostService } from '~/services/postServices';

const Post = ({
    id,
    posterId,
    firstName,
    lastName,
    avatar,
    visibility,
    content,
    createdAt,
    pictures = [],
    setPosts,
}) => {
    const maxVisibleImages = 4;
    let visibleImages;
    let remainingImages;
    if (pictures?.length > maxVisibleImages) {
        visibleImages = pictures.slice(0, maxVisibleImages - 1);
        remainingImages = pictures.length - maxVisibleImages + 1;
    } else {
        visibleImages = [...pictures];
    }

    const handleApprove = async () => {
        try {
            await approvePostService(id);
            setPosts((prev) => prev.filter((post) => post.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeny = async () => {
        try {
            await denyPostService(id);
            setPosts((prev) => prev.filter((post) => post.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={clsx(styles['post-content-wrapper'])}>
            <div className={clsx(styles['post-header'])}>
                <Link to={`/profile/${posterId}`}>
                    <img
                        className={clsx(styles['avatar-user'])}
                        src={avatar || defaultAvatar}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                        }}
                    />
                </Link>
                <div>
                    <h5 className={clsx(styles['post-username'])}>{`${lastName} ${firstName}`}</h5>
                    <div className={clsx('d-flex', styles['add-info'])}>
                        <span>{format(new Date(createdAt), 'dd/MM/yyyy')}</span>
                        <span>
                            <FontAwesomeIcon icon={faEarthAmerica} />
                            {/* <FontAwesomeIcon icon={faUserGroup} />
                    <FontAwesomeIcon icon={faLock} /> */}
                        </span>
                    </div>
                </div>
            </div>
            <div className={clsx(styles['post-content'], styles['background'])}>{content && <div>{content}</div>}</div>
            <PhotoProvider>
                <div
                    className={clsx(styles['images-layout'], {
                        [styles[`layout-${visibleImages?.length}`]]: remainingImages <= 0 || !remainingImages,
                        [styles[`layout-remaining`]]: remainingImages > 0,
                    })}
                >
                    {visibleImages?.map((img) => {
                        return (
                            <PhotoView key={`picture-${img?.id}`} src={img?.picture}>
                                <div className={clsx(styles['image-wrapper'])}>
                                    <img src={img?.picture} alt="" />
                                </div>
                            </PhotoView>
                        );
                    })}
                    {remainingImages > 0 && <Link className={clsx(styles['overlay'])}>+{remainingImages}</Link>}
                </div>
            </PhotoProvider>
            <div className={clsx(styles['approve-wrapper'])}>
                <div className={clsx(styles['btn-approve'])} onClick={handleApprove}>
                    Phê duyệt
                </div>
                <div className={clsx(styles['btn-deny'])} onClick={handleDeny}>
                    Từ chối
                </div>
            </div>
        </div>
    );
};

export default Post;
