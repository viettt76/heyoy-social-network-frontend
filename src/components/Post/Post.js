import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faEarthAmerica, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import logo from '~/assets/imgs/logo.png';
import styles from './Post.module.scss';
import { LikeIcon, LoveIcon, LoveLoveIcon, HaHaIcon, WowIcon, SadIcon, AngryIcon } from '~/components/Icons';
import avatarDefault from '~/assets/imgs/avatar-default.png';
import {
    cancelReleasedEmotionPostService,
    getAllEmotionsService,
    releaseEmotionPostService,
} from '~/services/postServices';
import _ from 'lodash';
import socket from '~/socket';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/redux/selectors';

// eslint-disable-next-line react/display-name
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <div
        className={clsx(styles['custom-toggle'])}
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children} <div className={clsx(styles['arrow-down'])}>&#x25bc;</div>
    </div>
));

const Comment = ({ comment }) => {
    return (
        <div className={clsx(styles['comment'])}>
            <img className={clsx(styles['commentator-avatar'])} src={comment?.commentator?.avatar} />
            <div className={clsx(styles['comment-info-wrapper'])}>
                <div className={clsx(styles['commentator-name-comment-content'])}>
                    <div className={clsx(styles['commentator-name'])}>{comment?.commentator?.name}</div>
                    <div className={clsx(styles['comment-content'])}>{comment?.content}</div>
                </div>
                {comment?.attachment}
                <div className={clsx(styles['comment-previous-time-action'])}>
                    <span className={clsx(styles['comment-previous-time'])}>{comment?.previousTime}</span>
                    <div className={clsx(styles['comment-action'])}>
                        <span className={clsx(styles['comment-action-item'], styles['comment-action-item-emo'])}>
                            Thích
                            <ul className={clsx(styles['emotion-list'])}>
                                <li className={clsx(styles['emotion'])}>
                                    <LikeIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <LoveIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <LoveLoveIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <HaHaIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <WowIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <SadIcon width={39} height={39} />
                                </li>
                                <li className={clsx(styles['emotion'])}>
                                    <AngryIcon width={39} height={39} />
                                </li>
                            </ul>
                        </span>
                        <span className={clsx(styles['comment-action-item'])}>Phản hồi</span>
                    </div>
                </div>
                <div>
                    {/* <div>Xem {comment?.childComments?.length} phản hồi</div> */}
                    <div className={clsx(styles['children-comment'])}>
                        {comment?.childComments?.length > 0 && (
                            <div>
                                {comment?.childComments?.map((childComment) => {
                                    return (
                                        <div key={`comment-${childComment?.id}`}>
                                            <Comment comment={childComment} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Post = ({ postInfo }) => {
    const {
        id,
        posterId,
        firstName,
        lastName,
        avatar,
        groupName,
        createAt,
        visibility,
        content,
        currentEmotionId,
        currentEmotionName,
        emotions = [],
        pictures = [],
    } = postInfo;
    const userInfo = useSelector(userInfoSelector);

    const [writeComment, setWriteComment] = useState('');

    const writeCommentRef = useRef(null);

    const [copyEmotions, setCopyEmotions] = useState(emotions);
    const [emotionsCustom, setEmotionsCustom] = useState([]);
    const [mostEmotions, setMostEmotions] = useState([]);
    const [currentEmotionNameCustom, setCurrentEmotionNameCustom] = useState(currentEmotionName);

    useEffect(() => {
        const emoCus = _.groupBy(copyEmotions, 'emotion.name');
        setEmotionsCustom(emoCus);

        const mostEmo = _.sortBy(emoCus, 'length').reverse();
        if (mostEmo.length > 0) {
            setMostEmotions([mostEmo[0][0]?.emotion?.name]);
            if (mostEmo.length > 1) {
                setMostEmotions((prev) => [...prev, mostEmo[1][0]?.emotion?.name]);
            }
        }
    }, [copyEmotions]);

    const maxVisibleImages = 4;
    let visibleImages;
    let remainingImages;
    if (pictures?.length > maxVisibleImages) {
        visibleImages = pictures.slice(0, maxVisibleImages - 1);
        remainingImages = pictures.length - maxVisibleImages + 1;
    } else {
        visibleImages = [...pictures];
    }

    const commentList = [
        {
            id: 'cmt01',
            commentator: {
                id: '01',
                name: 'Hoàng Việt',
                avatar: logo,
            },
            content:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos autem consequatur inventore vel laudantium magni reprehenderit, et ipsa qui earum.',
            previousTime: '4 phút',
            attachment: '',
            childComments: [
                {
                    id: 'cmt03',
                    commentator: {
                        id: '02',
                        name: 'Bùi Quyền',
                        avatar: logo,
                    },
                    content: 'udantium magni reprehenderit, et ipsa qui earum.',
                    previousTime: '4 phút',
                    attachment: '',
                    childComments: [
                        {
                            id: 'cmt03',
                            commentator: {
                                id: '02',
                                name: 'Bùi Quyền',
                                avatar: logo,
                            },
                            content: 'udantium magni reprehenderit, et ipsa qui earum.',
                            previousTime: '4 phút',
                            attachment: '',
                            childComments: [
                                {
                                    id: 'cmt03',
                                    commentator: {
                                        id: '02',
                                        name: 'Bùi Quyền',
                                        avatar: logo,
                                    },
                                    content: 'udantium magni reprehenderit, et ipsa qui earum.',
                                    previousTime: '4 phút',
                                    attachment: '',
                                    childComments: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'cmt08',
                    commentator: {
                        id: '03',
                        name: 'Hoàng Tặng',
                        avatar: logo,
                    },
                    content: 'Lorem ipsum dolor sit amet, consectetur',
                    previousTime: '4 phút',
                    attachment: '',
                    childComments: [],
                },
            ],
        },
        {
            id: 'cmt013',
            commentator: {
                id: '05',
                name: 'Văn Chiến',
                avatar: logo,
            },
            content: 'qui earum.',
            previousTime: '4 phút',
            attachment: '',
            childComments: [],
        },
    ];

    const handleFocusSendComment = () => {
        writeCommentRef.current.focus();
    };

    const [emotionsType, setEmotionsType] = useState([]);

    useEffect(() => {
        const fetchAllEmotions = async () => {
            try {
                const res = await getAllEmotionsService();
                setEmotionsType(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllEmotions();
    }, []);

    const emotionComponentMap = {
        Thích: LikeIcon,
        'Yêu thích': LoveIcon,
        'Thương thương': LoveLoveIcon,
        Haha: HaHaIcon,
        Wow: WowIcon,
        Buồn: SadIcon,
        'Phẫn nộ': AngryIcon,
    };

    const emotionClassMap = {
        Thích: styles['like-emotion'],
        'Yêu thích': styles['love-emotion'],
        'Thương thương': styles['loveLove-emotion'],
        Haha: styles['haha-emotion'],
        Wow: styles['wow-emotion'],
        Buồn: styles['sad-emotion'],
        'Phẫn nộ': styles['angry-emotion'],
    };

    const CurrentEmotion = emotionComponentMap[currentEmotionNameCustom];

    useEffect(() => {
        socket.on(
            'releaseEmotion',
            ({
                id: emoPostId,
                postId,
                userId: reactorId,
                firstName: reactorFirstName,
                lastName: reactorLastName,
                avatar: reactorAvatar,
                emotionTypeId,
                emotionTypeName,
            }) => {
                if (id === postId) {
                    setCopyEmotions((prev) => [
                        ...prev,
                        {
                            id: emoPostId,
                            emotion: {
                                id: emotionTypeId,
                                name: emotionTypeName,
                            },
                            userInfo: {
                                id: reactorId,
                                firstName: reactorFirstName,
                                lastName: reactorLastName,
                                avatar: reactorAvatar,
                            },
                        },
                    ]);
                }
            },
        );

        socket.on('updateEmotion', ({ id: emoPostId, postId, emotionTypeId, emotionTypeName }) => {
            if (id === postId) {
                setCopyEmotions((prev) => {
                    const clone = _.cloneDeep(prev);
                    const emo = _.find(clone, { id: emoPostId });
                    emo.emotion.id = emotionTypeId;
                    emo.emotion.name = emotionTypeName;
                    return clone;
                });
            }
        });
    }, [id]);

    const [showEmotionList, setShowEmotionList] = useState(false);
    const handleReleaseEmotion = async (emotionId) => {
        try {
            setShowEmotionList(false);
            await releaseEmotionPostService({ postId: id, emotionId });
            setCurrentEmotionNameCustom(emotionsType.find((emo) => emo.id === emotionId).name);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        socket.on('cancelReleasedEmotion', ({ postId, userId: userCancelReleaseEmotionId }) => {
            if (userInfo.id === userCancelReleaseEmotionId) {
                setCurrentEmotionNameCustom(null);
            }
            if (id === postId) {
                setCopyEmotions((prev) => {
                    const clone = _.filter(prev, (e) => e?.userInfo?.id !== userCancelReleaseEmotionId);
                    return clone;
                });
            }
        });
    }, [id]);

    const handleCancelReleasedEmotion = async () => {
        try {
            await cancelReleasedEmotionPostService({ postId: id });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={clsx(styles['post-wrapper'])}>
            <div className={clsx(styles['post-header'])}>
                <Link to={`/profile/${posterId}`}>
                    <img
                        className={clsx(styles['avatar-user'])}
                        src={avatar || avatarDefault}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = avatarDefault;
                        }}
                    />
                </Link>
                <div>
                    <h5 className={clsx(styles['post-username'])}>{`${lastName} ${firstName}`}</h5>
                    <div className={clsx('d-flex', styles['add-info'])}>
                        {groupName && <span>Quốc</span>}
                        <span>{moment(createAt).format('DD/MM/YYYY')}</span>
                        <span>
                            <FontAwesomeIcon icon={faEarthAmerica} />
                            {/* <FontAwesomeIcon icon={faUserGroup} />
                            <FontAwesomeIcon icon={faLock} /> */}
                        </span>
                    </div>
                </div>
            </div>
            <div className={clsx(styles['post-content'], styles['background'])}>{content && <div>{content}</div>}</div>
            <div
                className={clsx(styles['images-layout'], {
                    [styles[`layout-${visibleImages?.length}`]]: remainingImages <= 0 || !remainingImages,
                    [styles[`layout-remaining`]]: remainingImages > 0,
                })}
            >
                {visibleImages?.map((img, index) => {
                    return (
                        <Link className={clsx(styles['image-wrapper'])} key={`image-${index}`}>
                            <img src={img?.pictureUrl} />
                        </Link>
                    );
                })}
                {remainingImages > 0 && <Link className={clsx(styles['overlay'])}>+{remainingImages}</Link>}
            </div>
            <div className={clsx(styles['emotions-amount-of-comments'])}>
                <div className={clsx(styles['emotions-wrapper'])}>
                    {mostEmotions?.map((emo) => {
                        const Icon = emotionComponentMap[emo];
                        return (
                            <div key={`most-emotion-${emo}`} className={clsx(styles['emotion'])}>
                                <Icon width={18} height={18} />
                            </div>
                        );
                    })}
                    {copyEmotions?.length > 0 && (
                        <div className={clsx(styles['amount-of-emotions'])}>{copyEmotions?.length}</div>
                    )}
                </div>

                <div className={clsx(styles['amount-of-comments-wrapper'])}>
                    <span>32 bình luận</span>
                    <span>32 chia sẻ</span>
                </div>
            </div>
            <div className={clsx(styles['user-actions-wrapper'])}>
                <div
                    className={clsx(styles['user-action'], styles['show-emotion-list'])}
                    onMouseEnter={() => setShowEmotionList(true)}
                >
                    {currentEmotionNameCustom ? (
                        <div onClick={handleCancelReleasedEmotion}>
                            <CurrentEmotion width={20} height={20} />
                            <span
                                className={clsx(emotionClassMap[currentEmotionNameCustom], styles['released-emotion'])}
                            >
                                {currentEmotionNameCustom}
                            </span>
                        </div>
                    ) : (
                        <div onClick={() => handleReleaseEmotion(1)}>
                            <FontAwesomeIcon icon={faThumbsUp} />
                            <span>Thích</span>
                        </div>
                    )}
                    {showEmotionList && (
                        <ul className={clsx(styles['emotion-list'], {})}>
                            {emotionsType?.map((emotion) => {
                                const Icon = emotionComponentMap[emotion?.name];
                                return (
                                    <li
                                        key={`emotion-${emotion?.id}`}
                                        className={clsx(styles['emotion'])}
                                        onClick={() => handleReleaseEmotion(emotion?.id)}
                                    >
                                        <Icon width={39} height={39} />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <div className={clsx(styles['user-action'])} onClick={handleFocusSendComment}>
                    <FontAwesomeIcon icon={faComment} />
                    <span>Bình luận</span>
                </div>
                <div className={clsx(styles['user-action'])}>
                    <FontAwesomeIcon icon={faComment} />
                    <span>Chia sẻ</span>
                </div>
            </div>
            <div className={clsx(styles['comment-list-wrapper'])}>
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}>Tất cả bình luận</Dropdown.Toggle>

                    <Dropdown.Menu className={clsx(styles['comment-sorting-style'])}>
                        <div className={clsx(styles['comment-sorting-style-item'])}>Bình luận mới nhất</div>
                        <div className={clsx(styles['comment-sorting-style-item'])}>Bình luận cũ nhất</div>
                        <div className={clsx(styles['comment-sorting-style-item'])}>Bình luận nhiều cảm xúc nhất</div>
                    </Dropdown.Menu>
                </Dropdown>
                {/* <div className={clsx(styles['comment-list'])}>
                    {commentList?.map((comment) => {
                        return (
                            <div key={`comment-${comment?.id}`}>
                                <Comment comment={comment} />
                            </div>
                        );
                    })}
                </div> */}
                <div className={clsx(styles['write-comment-wrapper'])}>
                    <input
                        ref={writeCommentRef}
                        className={clsx(styles['write-comment'])}
                        placeholder="Viết bình luận"
                        onChange={(e) => setWriteComment(e.target.value)}
                    />
                    <i
                        className={clsx(styles['send-comment-btn'], {
                            [[styles['active']]]: writeComment,
                        })}
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default Post;
