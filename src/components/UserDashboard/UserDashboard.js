import clsx from 'clsx';
import styles from './UserDashboard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAccountService, logoutService } from '~/services/authServices';
import { useDispatch } from 'react-redux';
import * as actions from '~/redux/actions';
import socket from '~/socket';
import defaultAvatar from '~/assets/imgs/default-avatar.png';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Menu from '~/components/Menu';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const UserDashboard = ({ userDashboardRef, showUserDashboard, modalDeleteAccountRef }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector(userInfoSelector);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('isAuthenticated');
            await logoutService();
            dispatch(actions.clearUserInfo());
            dispatch(actions.closeAllChat());
            socket.disconnect();
        } catch (error) {
            console.log(error);
        } finally {
            navigate('/login');
        }
    };

    const [showModalDeleteAccount, setShowModalDeleteAccount] = useState(false);
    const [password, setPassword] = useState('');

    const handleShowModalDeleteAccount = () => setShowModalDeleteAccount(true);
    const handleHideModalDeleteAccount = () => {
        setShowModalDeleteAccount(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await deleteAccountService(password);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            handleHideModalDeleteAccount();
        }
    };

    const menu = [
        {
            id: 'main',
            depthLevel: 1,
            menu: [
                [
                    {
                        label: (
                            <Link className={clsx(styles['dashboard-link'])} to={`/profile/${userInfo?.id}`}>
                                <img
                                    className={clsx(styles['dashboard-avatar'])}
                                    src={userInfo?.avatar || defaultAvatar}
                                />
                                {`${userInfo?.lastName} ${userInfo?.firstName}`}
                            </Link>
                        ),
                    },
                ],
                [
                    {
                        label: (
                            <Link className={clsx(styles['dashboard-link'])}>
                                <FontAwesomeIcon icon={faGear} className={clsx(styles['dashboard-link-icon'])} />
                                Cài đặt
                            </Link>
                        ),
                        goToMenu: 'settings',
                    },
                    {
                        label: (
                            <div className={clsx(styles['dashboard-link'])} onClick={handleLogout}>
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className={clsx(styles['dashboard-link-icon'])}
                                />
                                Đăng xuất
                            </div>
                        ),
                    },
                ],
            ],
        },
        {
            id: 'settings',
            depthLevel: 2,
            back: 'main',
            menu: [
                {
                    label: <div onClick={handleShowModalDeleteAccount}>Xoá tài khoản</div>,
                },
            ],
        },
    ];

    return (
        <>
            {showUserDashboard ? (
                <>
                    <div ref={userDashboardRef} className={clsx(styles['dashboard-wrapper'])}>
                        <Menu menu={menu} top={0} right={0} className={clsx(styles['menu'])} />
                    </div>
                </>
            ) : (
                <div></div>
            )}
            <Modal
                ref={showModalDeleteAccount ? modalDeleteAccountRef : null}
                show={showModalDeleteAccount}
                onHide={handleHideModalDeleteAccount}
                className={clsx(styles['modal'])}
            >
                <Modal.Header className="fz-16" closeButton>
                    <Modal.Title>
                        <div className={clsx(styles['modal-title'])}>Xoá tài khoản</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="fz-16">
                        <div>
                            Không ai có thể nhìn thấy tài khoản của bạn, bao gồm tất cả nội dung được lưu trữ trong đó.
                        </div>
                        <div>Bạn có thể khôi phục lại tài khoản của mình và tất cả nội dung bất cứ lúc nào.</div>
                        <div className="mt-4">
                            **{' '}
                            <span className="fz-15">
                                Nếu bạn xác nhận xoá tài khoản vui lòng nhập mật khẩu và nhấn nút
                            </span>{' '}
                            <b>&quot;Xoá tài khoản&quot;</b> <span className="fz-15">để xác nhận xoá</span> **
                        </div>
                        <input
                            className="form-control mt-3"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex align-items-revert">
                        <div className={clsx(styles['btn-cancel'])} onClick={handleHideModalDeleteAccount}>
                            Huỷ
                        </div>
                        <Button className="fz-16" variant="danger" onClick={handleDeleteAccount}>
                            Xoá tài khoản
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserDashboard;
