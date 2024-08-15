import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import routes from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import ChatPopup from './components/ChatPopup/ChatPopup';
import { useDispatch } from 'react-redux';
import { getPersonalInfoService } from './services/userServices';
import { ToastContainer } from 'react-toastify';
import * as actions from '~/redux/actions';

function App() {
    return (
        <BrowserRouter>
            <FetchUserInfo />
            <Suspense fallback={<div></div>}>
                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.element;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = React.Fragment;
                        }
                        return (
                            <Route
                                key={`route-${index}`}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            ></Route>
                        );
                    })}
                </Routes>
            </Suspense>
            <ChatPopup />
            <ChatPopup />
            <ToastContainer />
        </BrowserRouter>
    );
}

function FetchUserInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchGetPersonalInfo = async () => {
            try {
                const res = await getPersonalInfoService();
                dispatch(actions.saveUserInfo(res?.data));
            } catch (error) {
                navigate('/login');
            }
        };

        if (location.pathname !== '/login') {
            fetchGetPersonalInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default App;
