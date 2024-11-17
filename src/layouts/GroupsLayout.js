import Header from '~/components/Header';
import SidebarGroups from '~/components/SidebarGroups';

const GroupsLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="d-flex">
                <SidebarGroups />
                {children}
            </div>
        </div>
    );
};

export default GroupsLayout;
