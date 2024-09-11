import Header from '~/containers/Header';
import SidebarFriends from '~/containers/SidebarFriends';

const FriendsLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="d-flex">
                <SidebarFriends />
                {children}
            </div>
        </div>
    );
};

export default FriendsLayout;
