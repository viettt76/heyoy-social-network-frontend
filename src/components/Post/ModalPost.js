import { forwardRef, useEffect, useRef, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import clsx from 'clsx';
import styles from './Post.module.scss';
import { LikeIcon, LoveIcon, LoveLoveIcon, HaHaIcon, WowIcon, SadIcon, AngryIcon } from '~/components/Icons';
import avatarDefault from '~/assets/imgs/avatar-default.png';
import { getCommentsService, sendCommentService } from '~/services/postServices';
import moment from 'moment';
import PostContent from './PostContent';
import socket from '~/socket';

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
    const [showChildComments, setShowChildComments] = useState(false);
    return (
        <div className={clsx(styles['comment'])}>
            <img
                className={clsx(styles['commentator-avatar'])}
                src={comment?.commentatorInfo?.avatar || avatarDefault}
            />
            <div className={clsx(styles['comment-info-wrapper'])}>
                <div className={clsx(styles['commentator-name-comment-content'])}>
                    <div
                        className={clsx(styles['commentator-name'])}
                    >{`${comment?.commentatorInfo?.lastName} ${comment?.commentatorInfo?.firstName}`}</div>
                    <div className={clsx(styles['comment-content'])}>{comment?.content}</div>
                </div>
                {/* {comment?.attachment} */}
                <div className={clsx(styles['comment-previous-time-action'])}>
                    <span className={clsx(styles['comment-previous-time'])}>
                        {moment(comment?.createAt).format('DD/MM')}
                    </span>
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
                    {comment?.children?.length > 0 &&
                        (showChildComments ? (
                            <div className={clsx(styles['fz-14'])} onClick={() => setShowChildComments(false)}>
                                Ẩn bớt
                            </div>
                        ) : (
                            <div className={clsx(styles['fz-14'])} onClick={() => setShowChildComments(true)}>
                                Xem {comment?.children?.length} phản hồi
                            </div>
                        ))}
                    {showChildComments && (
                        <div className={clsx(styles['children-comment'])}>
                            {comment?.children?.length > 0 && (
                                <div>
                                    {comment?.children?.map((childComment) => {
                                        return (
                                            <div key={`comment-${childComment?.id}`}>
                                                <Comment comment={childComment} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ModalPost = ({ postInfo, show, handleClose }) => {
    const { id } = postInfo;

    const [writeComment, setWriteComment] = useState('');

    const wRef = useRef(null);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getCommentsService(id);
                setComments(res?.comments);
            } catch (error) {
                console.log(error);
            }
        };
        fetchComments();
    }, [id]);

    const handleFocusSendComment = () => {
        wRef.current.focus();
    };

    const handleSendComment = async (e) => {
        if (e.key === 'Enter') {
            try {
                await sendCommentService({ postId: id, content: writeComment });
                setWriteComment('');
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        socket.emit('joinPost', id);
    }, [id]);

    console.log(comments);

    useEffect(() => {
        socket.on('newComment', (newComment) => {
            if (id === newComment.postId) {
                setComments((prev) => [
                    {
                        id: newComment?.id,
                        content: newComment?.content,
                        commentatorInfo: newComment?.commentatorInfo,
                        createdAt: newComment?.createdAt,
                        children: newComment?.children,
                    },
                    ...prev,
                ]);
            }
        });
    }, [id]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Body className={clsx(styles['modal-body'])}>
                <div className={clsx(styles['post-content-wrapper'])}>
                    <PostContent postInfo={postInfo} showModal={true} handleFocusSendComment={handleFocusSendComment} />
                    {comments?.length > 0 ? (
                        <div className={clsx(styles['comment-list-wrapper'])}>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle}>Tất cả bình luận</Dropdown.Toggle>

                                <Dropdown.Menu className={clsx(styles['comment-sorting-style'])}>
                                    <div className={clsx(styles['comment-sorting-style-item'])}>Bình luận mới nhất</div>
                                    <div className={clsx(styles['comment-sorting-style-item'])}>Bình luận cũ nhất</div>
                                    <div className={clsx(styles['comment-sorting-style-item'])}>
                                        Bình luận nhiều cảm xúc nhất
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className={clsx(styles['comment-list'])}>
                                {comments?.map((comment) => {
                                    return (
                                        <div key={`comment-${comment?.id}`}>
                                            <Comment comment={comment} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-5 mb-5 fz-16 text-center">Chưa có bình luận nào</div>
                    )}
                </div>
                <div className={clsx(styles['write-comment-wrapper'], styles['position-fixed'])}>
                    <input
                        ref={wRef}
                        value={writeComment}
                        className={clsx(styles['write-comment'])}
                        placeholder="Viết bình luận"
                        onChange={(e) => setWriteComment(e.target.value)}
                        onKeyDown={handleSendComment}
                    />
                    <i
                        className={clsx(styles['send-comment-btn'], {
                            [[styles['active']]]: writeComment,
                        })}
                    ></i>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPost;
