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

const Post = () => {
    const [writeComment, setWriteComment] = useState('');

    const writeCommentRef = useRef(null);

    const images = [logo, logo, logo, logo, logo];
    const maxVisibleImages = 4;
    let visibleImages;
    let remainingImages;
    if (images?.length > maxVisibleImages) {
        visibleImages = images.slice(0, maxVisibleImages - 1);
        remainingImages = images.length - maxVisibleImages + 1;
    } else {
        visibleImages = [...images];
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

    return (
        <div className={clsx(styles['post-wrapper'])}>
            <div className={clsx(styles['post-header'])}>
                <img className={clsx(styles['avatar-user'])} src={logo} />
                <div>
                    <h5 className={clsx(styles['post-username'])}>Hoàng Việt</h5>
                    <div className={clsx('d-flex', styles['add-info'])}>
                        <span>Quốc</span>
                        <span>21 phút</span>
                        <span>
                            <FontAwesomeIcon icon={faEarthAmerica} />
                            {/* <FontAwesomeIcon icon={faUserGroup} />
                            <FontAwesomeIcon icon={faLock} /> */}
                        </span>
                    </div>
                </div>
            </div>
            <div className={clsx(styles['post-content'], styles['background'])}>
                <div>
                    Ngày 20/7/2024, sự kiện “Ngày hội Gia đình phòng, chống đuối nước trẻ em” hưởng ứng Ngày Thế giới
                    phòng chống đuối nước 2024 sẽ được tổ chức tại Trung tâm văn hoá tỉnh Nghệ An - TP. Vinh, Nghệ An
                    với nhiều hoạt động tương tác cho cả gia đình.
                </div>
                <div>
                    Sự kiện được tổ chức bởi Cục Trẻ em (Bộ LĐTB&XH) phối hợp với Quỹ từ thiện Bloomberg, Hoa Kỳ; Tổ
                    chức Y tế Thế giới tại Việt Nam và Tổ chức Campaign For Tobacco-Free Kids, với chủ đề “Đuối Nước -
                    Khoảnh Khắc Sinh tồn”.
                </div>
                <div>
                    Thông qua các hoạt động trải nghiệm bổ ích, trẻ sẽ được nâng cao kiến thức, nhận thức về phòng,
                    chống đuối nước và được trang bị những kỹ năng an toàn cần thiết. Đặc biệt, với hoạt động “Giải
                    cứu”, phụ huynh và trẻ có thể cùng nhau luyện tập kỹ năng cứu đuối thông qua mô phỏng thao tác cứu
                    người trong tình huống nguy hiểm.
                </div>
            </div>
            <div
                className={clsx(styles['images-layout'], {
                    [styles[`layout-${visibleImages?.length}`]]: remainingImages <= 0 || !remainingImages,
                    [styles[`layout-remaining`]]: remainingImages > 0,
                })}
            >
                {visibleImages?.map((img, index) => {
                    return (
                        <Link to={img} className={clsx(styles['image-wrapper'])} key={`image-${index}`}>
                            <img src={img} />
                        </Link>
                    );
                })}
                {remainingImages > 0 && <Link className={clsx(styles['overlay'])}>+{remainingImages}</Link>}
            </div>
            <div className={clsx(styles['emotions-amount-of-comments'])}>
                <div className={clsx(styles['emotions-wrapper'])}>
                    <div className={clsx(styles['emotion'])}>
                        <LikeIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <LoveIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <LoveLoveIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <HaHaIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <WowIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <SadIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['emotion'])}>
                        <AngryIcon width={18} height={18} />
                    </div>
                    <div className={clsx(styles['amount-of-emotions'])}>180</div>
                </div>
                <div className={clsx(styles['amount-of-comments-wrapper'])}>
                    <span>32 bình luận</span>
                    <span>32 chia sẻ</span>
                </div>
            </div>
            <div className={clsx(styles['user-actions-wrapper'])}>
                <div className={clsx(styles['user-action'], styles['show-emotion-list'])}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>Thích</span>
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
                <div className={clsx(styles['comment-list'])}>
                    {commentList?.map((comment) => {
                        return (
                            <div key={`comment-${comment?.id}`}>
                                <Comment comment={comment} />
                            </div>
                        );
                    })}
                </div>
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
