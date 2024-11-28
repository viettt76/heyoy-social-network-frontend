import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './ManagePost.module.scss';
import { getPostsNotApprovedService } from '~/services/postServices';
import Post from './Post';

const ManagePost = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getPostsNotApprovedService();
                setPosts(res);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div className={clsx(styles['manage-post-wrapper'])}>
            {posts?.length > 0 &&
                posts.map((post) => {
                    return (
                        <Post
                            key={`post-${post?.id}`}
                            id={post?.id}
                            posterId={post?.posterId}
                            firstName={post?.posterInfo?.firstName}
                            lastName={post?.posterInfo?.lastName}
                            avatar={post?.posterInfo?.avatar}
                            visibility={post?.visibility}
                            content={post?.content}
                            createdAt={post?.createdAt}
                            pictures={post?.pictures}
                            setPosts={setPosts}
                        />
                    );
                })}
        </div>
    );
};

export default ManagePost;
