import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faLock, faPencil, faEye, faUnlock } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './UserProfileOwner.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loadingSelector, userInfoSelector } from '~/redux/selectors';
import { useState } from 'react';
import { Button, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { setPrivateProfileService, setPublicProfileService, updateMyInfoService } from '~/services/userServices';
import * as actions from '~/redux/actions';
import Cropper from 'react-easy-crop';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { Link, useLocation } from 'react-router-dom';
import { getCroppedImg, uploadToCloudinary } from '~/utils/commonUtils';
import LoadingOverlay from '~/components/LoadingOverlay';

const UserProfileOwnerHeader = ({ handleOnViewMode, numberOfFriends }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(userInfoSelector);
    const loading = useSelector(loadingSelector);

    const location = useLocation();

    const [updateAvatar, setUpdateAvatar] = useState(null);
    const [showModalUpdateAvatar, setShowModalUpdateAvatar] = useState(false);

    const handleChooseFile = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (s) => {
                setUpdateAvatar(s.target.result);
                setShowModalUpdateAvatar(true);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleHideModalUpdateAvatar = () => setShowModalUpdateAvatar(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async () => {
        try {
            dispatch(actions.startLoading('updateAvatar'));
            const croppedImage = await getCroppedImg(updateAvatar, croppedAreaPixels);
            const file = await fetch(croppedImage)
                .then((res) => res.blob())
                .then((blob) => new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
            const imageUrl = await uploadToCloudinary(file);
            await updateMyInfoService({ avatar: imageUrl });

            dispatch(actions.saveUserInfo({ avatar: imageUrl }));
            handleHideModalUpdateAvatar();
        } catch (error) {
            console.error('Failed to crop image', error);
        } finally {
            dispatch(actions.stopLoading('updateAvatar'));
        }
    };

    const [showModalSetPrivateProfile, setShowModalSetPrivateProfile] = useState(false);

    const handleShowModalSetPrivateProfile = () => setShowModalSetPrivateProfile(true);
    const handleHideModalSetPrivateProfile = () => setShowModalSetPrivateProfile(false);

    const handleSetPrivateProfile = async () => {
        try {
            dispatch(actions.startLoading('SetPrivateProfile'));
            await setPrivateProfileService();
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(actions.stopLoading('SetPrivateProfile'));
            handleHideModalSetPrivateProfile();
            window.location.reload();
        }
    };

    const [showModalSetPublicProfile, setShowModalSetPublicProfile] = useState(false);

    const handleShowModalSetPublicProfile = () => setShowModalSetPublicProfile(true);
    const handleHideModalSetPublicProfile = () => setShowModalSetPublicProfile(false);

    const handleSetPublicProfile = async () => {
        try {
            dispatch(actions.startLoading('SetPublicProfile'));
            await setPublicProfileService();
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(actions.stopLoading('SetPublicProfile'));
            handleHideModalSetPublicProfile();
            window.location.reload();
        }
    };

    return (
        <>
            {loading?.updateAvatar && <LoadingOverlay />}
            <div className={clsx(styles['header'])}>
                <div className={clsx(styles['header-left'])}>
                    <img className={clsx(styles['avatar'])} src={userInfo?.avatar || defaultAvatar} />
                    <div>
                        <h3 className={clsx(styles['full-name'])}>{`${userInfo.lastName} ${userInfo.firstName}`}</h3>
                        <div className={clsx(styles['number-of-friends'])}>{numberOfFriends} bạn bè</div>
                    </div>
                </div>
                <div className={clsx(styles['header-right'])}>
                    <label htmlFor="change-avatar-input" className={clsx(styles['edit-profile-btn'])}>
                        <FontAwesomeIcon icon={faPencil} />
                        <span>Đổi ảnh đại diện</span>
                    </label>
                    <input type="file" id="change-avatar-input" hidden onChange={handleChooseFile} />
                    <Modal
                        className={clsx(styles['modal'])}
                        show={showModalUpdateAvatar}
                        onHide={handleHideModalUpdateAvatar}
                    >
                        <Modal.Header>
                            <Modal.Title>Chọn ảnh đại diện</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={clsx(styles['modal-body'])}>
                            <div className={clsx(styles['crop-container'])}>
                                <Cropper
                                    image={updateAvatar}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>
                            <div className={clsx(styles['controls'])}>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => {
                                        setZoom(e.target.value);
                                    }}
                                    className={clsx(styles['zoom-range'])}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="d-flex align-items-revert">
                                <div className={clsx(styles['btn-cancel'])} onClick={handleHideModalUpdateAvatar}>
                                    Huỷ
                                </div>
                                <Button variant="primary" className="fz-16" onClick={handleSave}>
                                    Xác nhận
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                    <div className={clsx(styles['header-right-menu'])}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                <FontAwesomeIcon className={clsx(styles['header-right-menu-icon'])} icon={faEllipsis} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleOnViewMode} className={clsx(styles['dropdown-item'])}>
                                    <FontAwesomeIcon className={clsx(styles['dropdown-item-icon'])} icon={faEye} />{' '}
                                    <span>Xem với view người khác</span>
                                </Dropdown.Item>
                                {userInfo?.isPrivate ? (
                                    <Dropdown.Item
                                        onClick={handleShowModalSetPublicProfile}
                                        className={clsx(styles['dropdown-item'])}
                                    >
                                        <FontAwesomeIcon
                                            className={clsx(styles['dropdown-item-icon'])}
                                            icon={faUnlock}
                                        />
                                        <span>Đặt trang cá nhân công khai</span>
                                    </Dropdown.Item>
                                ) : (
                                    <Dropdown.Item
                                        onClick={handleShowModalSetPrivateProfile}
                                        className={clsx(styles['dropdown-item'])}
                                    >
                                        <FontAwesomeIcon className={clsx(styles['dropdown-item-icon'])} icon={faLock} />
                                        <span>Đặt trang cá nhân riêng tư</span>
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Modal
                            show={showModalSetPrivateProfile}
                            onHide={handleHideModalSetPrivateProfile}
                            className={clsx(styles['modal-private-profile'])}
                        >
                            <Modal.Header>
                                <Modal.Title>
                                    <div className={clsx(styles['modal-title'])}>Đặt trang cá nhân riêng tư</div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className={clsx(styles['modal-text'])}>
                                    Những người khác sẽ chỉ nhìn thấy tên và ảnh đại diện của bạn
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    className={clsx('w-100 fz-16 d-flex align-items-center justify-content-center', {
                                        [[styles['not-allowed']]]: loading?.SetPrivateProfile,
                                    })}
                                    onClick={!loading?.SetPrivateProfile && handleSetPrivateProfile}
                                >
                                    {loading?.SetPrivateProfile && <Spinner className={clsx(styles['spinner'])} />}Đặt
                                    trang cá nhân riêng tư
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal
                            show={showModalSetPublicProfile}
                            onHide={handleHideModalSetPublicProfile}
                            className={clsx(styles['modal-private-profile'])}
                        >
                            <Modal.Header>
                                <Modal.Title>
                                    <div className={clsx(styles['modal-title'])}>Đặt trang cá nhân công khai</div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className={clsx(styles['modal-text'])}>
                                    Mọi người đều có thể xem ảnh và bài viết trên dòng thời gian của bạn
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    className={clsx('w-100 fz-16 d-flex align-items-center justify-content-center', {
                                        [[styles['not-allowed']]]: loading?.SetPublicProfile,
                                    })}
                                    onClick={!loading?.SetPublicProfile && handleSetPublicProfile}
                                >
                                    {loading?.SetPublicProfile && <Spinner className={clsx(styles['spinner'])} />}Đặt
                                    trang cá nhân công khai
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            <div className={clsx(styles['profile-tabs-wrapper'])}>
                <Link
                    className={clsx(styles['profile-tabs'], {
                        [[styles['active']]]: location.pathname.toLowerCase() === `/profile/${userInfo?.id}`,
                    })}
                    to={`/profile/${userInfo?.id}`}
                >
                    Bài đăng
                </Link>
                <Link
                    className={clsx(styles['profile-tabs'], {
                        [[styles['active']]]: location.pathname.toLowerCase() === `/profile/${userInfo?.id}/friends`,
                    })}
                    to={`/profile/${userInfo?.id}/friends`}
                >
                    Bạn bè
                </Link>
                <Link
                    className={clsx(styles['profile-tabs'], {
                        [[styles['active']]]: location.pathname.toLowerCase() === `/profile/${userInfo?.id}/photos`,
                    })}
                    to={`/profile/${userInfo?.id}/photos`}
                >
                    Ảnh
                </Link>
            </div>
        </>
    );
};

export default UserProfileOwnerHeader;
