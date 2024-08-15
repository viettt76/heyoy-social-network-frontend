import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import styles from './Login.module.scss';
import customToastify from '~/utils/customToastify';
import { getPersonalInfoService, loginService, signUpService } from '~/services/userServices';
import * as actions from '~/redux/actions';

function Login() {
    const navigate = useNavigate(null);
    const dispatch = useDispatch();
    const userInfo = useSelector(userInfoSelector);

    useEffect(() => {
        if (userInfo.id) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [validatedFormLogin, setValidatedFormLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');

    const loginFormRef = useRef(null);
    const signUpFormRef = useRef(null);
    const usernameSignupRef = useRef(null);

    const [signUpInfo, setSignUpInfo] = useState({
        lastName: '',
        firstName: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [showFormSignUp, setShowFormSignUp] = useState(false);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
    const [validatedFormSignUp, setValidatedFormSignUp] = useState(false);
    const [usernameExisted, setUsernameExisted] = useState([]);

    const toggleShowPasswordLogin = () => {
        setShowPasswordLogin(!showPasswordLogin);
    };

    const toggleShowPasswordSignUp = () => {
        setShowPasswordSignUp(!showPasswordSignUp);
    };

    const handleCloseFormSignUp = () => setShowFormSignUp(false);
    const handleShowFormSignUp = () => setShowFormSignUp(true);

    const handleChangeFormLogin = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    const handleSubmitFormLogin = async (e) => {
        try {
            const form = loginFormRef.current;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
                setValidatedFormLogin(true);
            } else {
                await loginService(loginInfo);
                navigate('/');
                const fetchGetPersonalInfo = async () => {
                    try {
                        const res = await getPersonalInfoService();
                        dispatch(actions.saveUserInfo(res?.data));
                    } catch (error) {
                        console.log(error);
                    }
                };
                fetchGetPersonalInfo();
            }
        } catch (error) {
            setErrorLogin('Tài khoản hoặc mật khẩu của bạn không chính xác');
        }
    };

    const handleEnterToLogin = (e) => {
        if (e.key === 'Enter') {
            handleSubmitFormLogin(e);
        }
    };

    const handleChangeFormSignUp = (e) => {
        const { name, value } = e.target;
        setSignUpInfo({
            ...signUpInfo,
            [name]: value,
        });
    };

    const handleSubmitFormSignUp = async (e) => {
        try {
            const form = signUpFormRef.current;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
                setValidatedFormSignUp(true);
            } else {
                await signUpService({
                    lastName: signUpInfo.lastName,
                    firstName: signUpInfo.firstName,
                    username: signUpInfo.username,
                    password: signUpInfo.password,
                });

                customToastify.success('Đăng ký tài khoản thành công!');

                setSignUpInfo({
                    lastName: '',
                    firstName: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                });

                setValidatedFormSignUp(false);
                setShowFormSignUp(false);
            }
        } catch (error) {
            if (Number(error.status) === 400) {
                setValidatedFormSignUp(true);
                setUsernameExisted([...usernameExisted, signUpInfo.username]);
            }
        }
    };

    const handleEnterToSignup = (e) => {
        if (e.key === 'Enter') {
            handleSubmitFormSignUp(e);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <div className={clsx('p-4', styles['login-wrapper'])}>
                <Form ref={loginFormRef} noValidate validated={validatedFormLogin}>
                    <Form.Group className="mb-3" as={Col} md="12">
                        <Form.Control
                            value={loginInfo.username}
                            name="username"
                            className="fz-16"
                            type="text"
                            placeholder="Username"
                            required
                            onKeyUp={handleEnterToLogin}
                            onChange={handleChangeFormLogin}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative" as={Col} md="12">
                        <Form.Control
                            value={loginInfo.password}
                            name="password"
                            className="fz-16"
                            type={showPasswordLogin ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            onKeyUp={handleEnterToLogin}
                            onChange={handleChangeFormLogin}
                        />
                        {showPasswordLogin ? (
                            <FontAwesomeIcon
                                className={clsx(styles['show-hide-password'])}
                                icon={faEye}
                                onClick={toggleShowPasswordLogin}
                            />
                        ) : (
                            <FontAwesomeIcon
                                className={clsx(styles['show-hide-password'])}
                                icon={faEyeSlash}
                                onClick={toggleShowPasswordLogin}
                            />
                        )}
                    </Form.Group>
                    {errorLogin && (
                        <div className={clsx('mb-3', styles['invalid-feedback'])}>
                            Tài khoản hoặc mật khẩu của bạn không chính xác
                        </div>
                    )}
                </Form>
                <Button className="w-100 fz-16" onClick={handleSubmitFormLogin}>
                    Đăng nhập
                </Button>
                <Link to="forgot-password" className={clsx(styles['forgot-password'])}>
                    Quên mật khẩu?
                </Link>
                <div className={clsx('d-flex justify-content-center', styles['sign-up-wrapper'])}>
                    <Button className={clsx(styles['sign-up-btn'])} onClick={handleShowFormSignUp}>
                        Tạo tài khoản mới
                    </Button>

                    <Modal show={showFormSignUp} onHide={handleCloseFormSignUp}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <div className={clsx(styles['modal-sign-up-title'])}>Đăng ký</div>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form ref={signUpFormRef} noValidate validated={validatedFormSignUp}>
                                <Row>
                                    <Form.Group className="mb-3" as={Col} md="6">
                                        <Form.Control
                                            value={signUpInfo.lastName}
                                            name="lastName"
                                            className="fz-16"
                                            placeholder="Họ"
                                            required
                                            onKeyUp={handleEnterToSignup}
                                            onChange={handleChangeFormSignUp}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" as={Col} md="6">
                                        <Form.Control
                                            value={signUpInfo.firstName}
                                            name="firstName"
                                            className="fz-16"
                                            placeholder="Tên"
                                            required
                                            onKeyUp={handleEnterToSignup}
                                            onChange={handleChangeFormSignUp}
                                        />
                                    </Form.Group>
                                </Row>
                                <Form.Group className="mb-3" as={Col} md="12">
                                    <Form.Control
                                        ref={usernameSignupRef}
                                        value={signUpInfo.username}
                                        name="username"
                                        className={clsx('fz-16', {
                                            [styles['invalid']]: usernameExisted.includes(signUpInfo.username),
                                        })}
                                        placeholder="Username"
                                        required
                                        onKeyUp={handleEnterToSignup}
                                        isInvalid={usernameExisted.includes(signUpInfo.username)}
                                        onChange={handleChangeFormSignUp}
                                    />
                                    {usernameExisted.includes(signUpInfo.username) && (
                                        <Form.Control.Feedback className="fz-16" type="invalid">
                                            Tài khoản đã tồn tại
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3 position-relative" as={Col} md="12">
                                    <Form.Control
                                        value={signUpInfo.password}
                                        name="password"
                                        type={showPasswordSignUp ? 'text' : 'password'}
                                        className="fz-16"
                                        minLength={6}
                                        placeholder="Password"
                                        required
                                        onKeyUp={handleEnterToSignup}
                                        onChange={handleChangeFormSignUp}
                                    />
                                    <Form.Control.Feedback className="fz-16" type="invalid">
                                        Mật khẩu ít nhất 6 ký tự
                                    </Form.Control.Feedback>
                                    {showPasswordSignUp ? (
                                        <FontAwesomeIcon
                                            className={clsx(styles['show-hide-password'])}
                                            icon={faEye}
                                            onClick={toggleShowPasswordSignUp}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            className={clsx(styles['show-hide-password'])}
                                            icon={faEyeSlash}
                                            onClick={toggleShowPasswordSignUp}
                                        />
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md="12">
                                    <Form.Control
                                        value={signUpInfo.confirmPassword}
                                        name="confirmPassword"
                                        type={showPasswordSignUp ? 'text' : 'password'}
                                        className="fz-16"
                                        minLength={6}
                                        placeholder="Confirm Password"
                                        required
                                        onKeyUp={handleEnterToSignup}
                                        pattern={signUpInfo.password}
                                        isInvalid={
                                            validatedFormSignUp && signUpInfo.password !== signUpInfo.confirmPassword
                                        }
                                        onChange={handleChangeFormSignUp}
                                    />
                                    <Form.Control.Feedback className="fz-16" type="invalid">
                                        Mật khẩu xác nhận sai
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className={clsx('fz-16', styles['sign-up-btn'])} onClick={handleSubmitFormSignUp}>
                                Đăng ký
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Login;
