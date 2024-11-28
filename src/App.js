import React, { createContext, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import routes, { protectedRoutes } from '~/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import { useDispatch } from 'react-redux';
import { getMyInfoService } from '~/services/userServices';
import { ToastContainer } from 'react-toastify';
import * as actions from '~/redux/actions';
import { SetupInterceptors } from '~/utils/axios';
import { useSelector } from 'react-redux';
import { openChatsSelector, userInfoSelector } from '~/redux/selectors';
import ChatGroupPopup from '~/components/ChatGroupPopup';
import ChatPopup from '~/components/ChatPopup';
import CallRequestWindow from '~/components/CallRequestWindow';
import { getAllEmotionsService } from '~/services/postServices';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function NavigateFunctionComponent() {
    let navigate = useNavigate();
    const [ran, setRan] = useState(false);

    if (!ran) {
        SetupInterceptors(navigate);
        setRan(true);
    }
    return <></>;
}

function App() {
    const openChats = useSelector(openChatsSelector);
    const userInfo = useSelector(userInfoSelector);

    return (
        <FetchAllEmotionsPost>
            <BrowserRouter>
                <NavigateFunctionComponent />
                <ScrollToTop />
                <FetchUserInfo />
                <CallRequestWindow />
                {openChats?.slice(0, 2)?.map((item, index) => {
                    if (item?.isGroupChat) {
                        return <ChatGroupPopup index={index} key={`group-chat-${item?.id}`} group={item} />;
                    }
                    return <ChatPopup index={index} key={`friend-chat-${item?.id}`} friend={item} />;
                })}
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
                        {userInfo?.role === 'admin' &&
                            protectedRoutes.map((route, index) => {
                                const Page = route.element;
                                let Layout = DefaultLayout;
                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = React.Fragment;
                                }
                                return (
                                    <Route
                                        key={`route-admin-${index}`}
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
                <ToastContainer />
            </BrowserRouter>
        </FetchAllEmotionsPost>
    );
}

function FetchUserInfo() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const res = await getMyInfoService();
                dispatch(actions.saveUserInfo(res));
            } catch (error) {
                console.log(error);
            }
        };

        if (location.pathname.toLocaleLowerCase() !== '/login') {
            fetchPersonalInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export const EmotionsTypeContext = createContext(null);

function FetchAllEmotionsPost({ children }) {
    const [emotionsType, setEmotionsType] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllEmotionsService();
                setEmotionsType(res);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return <EmotionsTypeContext.Provider value={emotionsType}>{children}</EmotionsTypeContext.Provider>;
}

export default App;
