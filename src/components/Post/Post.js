import clsx from 'clsx';
import PostContent from './PostContent';
import styles from './Post.module.scss';
import { sendCommentService } from '~/services/postServices';
import { useCallback, useEffect, useRef, useState } from 'react';
import ModalPost from './ModalPost';
import socket from '~/socket';
import { cloneDeep, find } from 'lodash';

const Post = ({ postInfo }) => {
    const { id, currentEmotionName, emotions } = postInfo;
    const [currentEmotionNameCustom, setCurrentEmotionNameCustom] = useState(currentEmotionName);
    const [copyEmotions, setCopyEmotions] = useState(emotions);

    const [writeComment, setWriteComment] = useState('');
    const [showWriteComment, setShowWriteComment] = useState(false);

    const writeCommentRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = () => setShowModal(false);

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

    const handleShowWriteComment = useCallback(() => {
        setShowWriteComment(true);
        handleFocusSendComment();
    }, []);

    const handleFocusSendComment = () => {
        writeCommentRef.current.focus();
    };

    useEffect(() => {
        if (showWriteComment) {
            handleFocusSendComment();
        }
    }, [showWriteComment]);

    useEffect(() => {
        const handleReleaseEmotion = ({
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
        };

        const handleUpdateEmotion = ({ id: emoPostId, postId, emotionTypeId, emotionTypeName }) => {
            if (id === postId) {
                setCopyEmotions((prev) => {
                    const clone = cloneDeep(prev);
                    const emo = find(clone, { id: emoPostId });
                    if (emo) {
                        emo.emotion.id = emotionTypeId;
                        emo.emotion.name = emotionTypeName;
                    }
                    return clone;
                });
            }
        };

        socket.on('releaseEmotion', handleReleaseEmotion);
        socket.on('updateEmotion', handleUpdateEmotion);

        return () => {
            socket.off('releaseEmotiff', handleReleaseEmotion);
            socket.off('updateEmotion', handleUpdateEmotion);
        };
    }, [id, setCopyEmotions]);

    return (
        <div className={clsx(styles['post-wrapper'])}>
            <div>
                <PostContent
                    postInfo={postInfo}
                    handleShowWriteComment={handleShowWriteComment}
                    showModal={showModal}
                    currentEmotionNameCustom={currentEmotionNameCustom}
                    setCurrentEmotionNameCustom={setCurrentEmotionNameCustom}
                    copyEmotions={copyEmotions}
                    setCopyEmotions={setCopyEmotions}
                    handleShowModal={handleShowModal}
                />
                <div
                    className={clsx(styles['write-comment-wrapper'], styles['animation'], {
                        [[styles['d-none']]]: !showWriteComment,
                    })}
                >
                    <input
                        ref={writeCommentRef}
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
            </div>
            <ModalPost
                postInfo={postInfo}
                show={showModal}
                currentEmotionNameCustom={currentEmotionNameCustom}
                setCurrentEmotionNameCustom={setCurrentEmotionNameCustom}
                copyEmotions={copyEmotions}
                setCopyEmotions={setCopyEmotions}
                handleClose={handleCloseModal}
            />
        </div>
    );
};

export default Post;
