import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding,
    faCakeCandles,
    faEllipsis,
    faGraduationCap,
    faLocationDot,
    faPencil,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Profile.module.scss';
import Post from '~/components/Post';
import logo from '~/assets/imgs/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import { useEffect, useState } from 'react';
import { getMyPostService } from '~/services/postServices';
import { Button, Form, Modal } from 'react-bootstrap';
import { updatePersonalInfoService } from '~/services/userServices';
import * as actions from '~/redux/actions';
import WritePost from '~/components/WritePost';
import socket from '~/socket';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import DatePicker from 'react-datepicker';
import { calculateTime } from '~/utils/commonUtils';

const Profile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector(userInfoSelector);
    const [myPosts, setMyPosts] = useState([]);

    const [showModalUpdateIntroductoryInfo, setShowModalUpdateIntroductoryInfo] = useState(false);
    const [introductoryInfo, setIntroductoryInfo] = useState({
        homeTown: '',
        school: '',
        workplace: '',
        birthday: '',
    });

    const [birthdayDisplay, setBirthdayDisplay] = useState(null);

    useEffect(() => {
        setIntroductoryInfo({
            homeTown: userInfo?.homeTown ? userInfo.homeTown : '',
            school: userInfo?.school ? userInfo.school : '',
            workplace: userInfo?.workplace ? userInfo.workplace : '',
            birthday: userInfo?.birthday ? userInfo.birthday : '',
        });

        setBirthdayDisplay(calculateTime(new Date(userInfo?.birthday).toISOString()));
    }, [userInfo]);

    const handleShowModalUpdateIntroductoryInfo = () => setShowModalUpdateIntroductoryInfo(true);
    const handleHideModalUpdateIntroductoryInfo = () => {
        setShowModalUpdateIntroductoryInfo(false);
        setIntroductoryInfo({
            homeTown: userInfo?.homeTown ? userInfo.homeTown : '',
            school: userInfo?.school ? userInfo.school : '',
            workplace: userInfo?.workplace ? userInfo.workplace : '',
            birthday: userInfo?.birthday ? userInfo.birthday : '',
        });
    };

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

    const handleUpdateForm = (e) => {
        const { name, value } = e.target;

        setIntroductoryInfo({
            ...introductoryInfo,
            [name]: value,
        });
    };

    const handleUpdateIntroductoryInfo = async () => {
        try {
            await updatePersonalInfoService({
                homeTown: introductoryInfo.homeTown,
                school: introductoryInfo.school,
                workplace: introductoryInfo.workplace,
                birthday: introductoryInfo.birthday,
            });

            dispatch(
                actions.saveUserInfo({
                    homeTown: introductoryInfo.homeTown,
                    school: introductoryInfo.school,
                    workplace: introductoryInfo.workplace,
                    birthday: introductoryInfo.birthday,
                }),
            );
        } catch (error) {
            console.log(error);
        } finally {
            setShowModalUpdateIntroductoryInfo(false);
        }
    };

    useEffect(() => {
        const handleNewPost = (newPost) => {
            setMyPosts((prev) => [{ ...newPost, currentEmotionId: null, currentEmotionName: null }, ...prev]);
        };
        socket.on('myNewPost', handleNewPost);

        return () => {
            socket.off('myNewPost', handleNewPost);
        };
    }, []);

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

    const getCroppedImg = (imageSrc, crop) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = crop.width;
                canvas.height = crop.height;

                ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject('Canvas is empty');
                    }
                    const fileUrl = URL.createObjectURL(blob);
                    resolve(fileUrl);
                }, 'image/jpeg');
            };
            image.onerror = reject;
        });
    };

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const uploadToCloudinary = async (croppedImage) => {
        let formData = new FormData();

        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_KEY);
        formData.append('file', croppedImage);
        formData.append('public_id', `file_${Date.now()}`);
        formData.append('timestamp', (Date.now() / 1000) | 0);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
            return res.data?.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
        }
    };

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(updateAvatar, croppedAreaPixels);
            const file = await fetch(croppedImage)
                .then((res) => res.blob())
                .then((blob) => new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
            const imageUrl = await uploadToCloudinary(file);
            await updatePersonalInfoService({ avatar: imageUrl });

            dispatch(actions.saveUserInfo({ avatar: imageUrl }));
            handleHideModalUpdateAvatar();
        } catch (error) {
            console.error('Failed to crop image', error);
        }
    };

    return (
        <div className={clsx('container', styles['profile-wrapper'])}>
            <div className={clsx(styles['header'])}>
                <div className={clsx(styles['header-left'])}>
                    <img className={clsx(styles['avatar'])} src={userInfo?.avatar || defaultAvatar} />
                    <div>
                        <h3 className={clsx(styles['full-name'])}>{`${userInfo.lastName} ${userInfo.firstName}`}</h3>
                        <div className={clsx(styles['number-of-friends'])}>207 bạn bè</div>
                    </div>
                </div>
                <div className={clsx(styles['header-right'])}>
                    <label htmlFor="change-avatar-input" className={clsx(styles['edit-profile-btn'])}>
                        <FontAwesomeIcon icon={faPencil} />
                        <span>Đổi ảnh đại diện</span>
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
                    </label>
                    <input type="file" id="change-avatar-input" hidden onChange={handleChooseFile} />
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

                            <button
                                className={clsx(styles['btn-add-intro'], {
                                    ['mt-3']:
                                        userInfo?.birthday ||
                                        userInfo?.homeTown ||
                                        userInfo?.school ||
                                        userInfo?.workplace,
                                })}
                                onClick={handleShowModalUpdateIntroductoryInfo}
                            >
                                Thêm thông tin giới thiệu
                            </button>
                            <Modal
                                show={showModalUpdateIntroductoryInfo}
                                className={clsx(styles['modal'])}
                                onHide={handleHideModalUpdateIntroductoryInfo}
                            >
                                <Modal.Header className="d-flex justify-content-center">
                                    <Modal.Title className={clsx(styles['modal-title'])}>
                                        Thông tin giới thiệu
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <Form.Label>Ngày sinh</Form.Label>
                                                <Button
                                                    variant="danger fz-14"
                                                    onClick={() =>
                                                        setIntroductoryInfo((prev) => ({ ...prev, birthday: '' }))
                                                    }
                                                >
                                                    Xoá
                                                </Button>
                                            </div>
                                            <DatePicker
                                                selected={introductoryInfo?.birthday}
                                                onChange={(date) => {
                                                    setIntroductoryInfo((prev) => ({ ...prev, birthday: date }));
                                                }}
                                                className={clsx('form-control', styles['datepicker'])}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Ngày/tháng/năm"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <Form.Label>Quê quán</Form.Label>
                                                <Button
                                                    variant="danger fz-14"
                                                    onClick={() =>
                                                        setIntroductoryInfo((prev) => ({ ...prev, homeTown: '' }))
                                                    }
                                                >
                                                    Xoá
                                                </Button>
                                            </div>
                                            <Form.Control
                                                name="homeTown"
                                                value={introductoryInfo?.homeTown}
                                                onChange={handleUpdateForm}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdateIntroductoryInfo();
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <Form.Label>Trường học</Form.Label>

                                                <Button
                                                    variant="danger fz-14"
                                                    onClick={() =>
                                                        setIntroductoryInfo((prev) => ({ ...prev, school: '' }))
                                                    }
                                                >
                                                    Xoá
                                                </Button>
                                            </div>
                                            <Form.Control
                                                name="school"
                                                value={introductoryInfo?.school}
                                                onChange={handleUpdateForm}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdateIntroductoryInfo();
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <Form.Label>Nơi làm việc</Form.Label>
                                                <Button
                                                    variant="danger fz-14"
                                                    onClick={() =>
                                                        setIntroductoryInfo((prev) => ({ ...prev, workplace: '' }))
                                                    }
                                                >
                                                    Xoá
                                                </Button>
                                            </div>
                                            <Form.Control
                                                name="workplace"
                                                value={introductoryInfo?.workplace}
                                                onChange={handleUpdateForm}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdateIntroductoryInfo();
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="fz-16" onClick={handleUpdateIntroductoryInfo}>
                                        Cập nhật
                                    </Button>
                                </Modal.Footer>
                            </Modal>
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

export default Profile;
