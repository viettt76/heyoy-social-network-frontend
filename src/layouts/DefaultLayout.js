import Header from '~/containers/Header';
import Sidebar from '~/containers/Sidebar';
import FriendsList from '../containers/FriendsList/FriendsList';

const DefaultLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="d-flex justify-content-between">
                <Sidebar />
                <div>{children}</div>
                <FriendsList />
            </div>
        </div>
    );
};

export default DefaultLayout;
