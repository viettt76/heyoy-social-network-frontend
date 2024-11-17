import { Navigate, Route, Routes } from 'react-router-dom';
import MyGroups from './MyGroups';
import DiscoverGroups from './DiscoverGroups';

const Groups = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="joins" />} />
            <Route path="joins" element={<MyGroups />} />
            <Route path="discover" element={<DiscoverGroups />} />
        </Routes>
    );
};

export default Groups;
