import clsx from 'clsx';
import styles from './Messenger.module.scss';
import avatar from '~/assets/imgs/default-avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Messenger = ({ messengerRef, showMessenger }) => {
    return (
        <div
            ref={messengerRef}
            className={clsx(styles['messenger-wrapper'], {
                [styles['showMessenger']]: showMessenger,
            })}
        >
            <div className={clsx(styles['search-wrapper'])}>
                <FontAwesomeIcon className={clsx(styles['search-icon'])} icon={faMagnifyingGlass} />
                <input className={clsx(styles['search-input'])} placeholder="Tìm kiếm" />
            </div>
            <div className={clsx(styles['conversation-wrapper'])}>
                <div className={clsx(styles['conversation'])}>
                    <img className={clsx(styles['avatar'])} src={avatar} />
                    <div>
                        <h6 className={clsx(styles['name'])}>Hoàng Việt</h6>
                        <div className={clsx(styles['last-message'])}>Không biết nữa</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messenger;
