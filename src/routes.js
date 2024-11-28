import { lazy } from 'react';

import OnlyHeaderLayout from '~/layouts/OnlyHeaderLayout';
import FriendsLayout from '~/layouts/FriendsLayout';
import GroupsLayout from '~/layouts/GroupsLayout';
import AdminLayout from '~/layouts/AdminLayout';

const Home = lazy(() => import('~/pages/Home'));
const Login = lazy(() => import('~/pages/Login'));
const Profile = lazy(() => import('~/pages/Profile'));
const MyFriends = lazy(() => import('~/pages/Friends/MyFriends'));
const FriendRequests = lazy(() => import('~/pages/Friends/FriendRequests'));
const FriendSuggestions = lazy(() => import('~/pages/Friends/FriendSuggestions'));
const SentFriendRequests = lazy(() => import('~/pages/Friends/SentFriendRequests'));
const CallingWindow = lazy(() => import('~/pages/CallingWindow'));
const Groups = lazy(() => import('~/pages/Groups'));
const ManagePost = lazy(() => import('~/pages/Admin/ManagePost'));

const routes = [
    { path: '/', element: Home },
    { path: '/login', element: Login, layout: null },
    { path: '/profile/:userId/*', element: Profile, layout: OnlyHeaderLayout },
    { path: '/friends', element: MyFriends, layout: FriendsLayout },
    { path: '/friends/requests', element: FriendRequests, layout: FriendsLayout },
    { path: '/friends/sent-requests', element: SentFriendRequests, layout: FriendsLayout },
    { path: '/friends/suggestions', element: FriendSuggestions, layout: FriendsLayout },
    { path: '/calling', element: CallingWindow, layout: null },
    { path: '/groups/*', element: Groups, layout: GroupsLayout },
];

export const protectedRoutes = [{ path: '/admin/manage-post', element: ManagePost, layout: AdminLayout }];

export default routes;
