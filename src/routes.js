import { lazy } from 'react';

import OnlyHeaderLayout from '~/layouts/OnlyHeaderLayout';

import Home from '~/pages/Home';
const Login = lazy(() => import('~/pages/Login'));
import Profile from '~/pages/Profile/Profile';

const routes = [
    { path: '/', element: Home },
    { path: '/login', element: Login, layout: null },
    { path: '/profile', element: Profile, layout: OnlyHeaderLayout },
];

export default routes;
