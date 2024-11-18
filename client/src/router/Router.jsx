import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authAction } from '../actions/user.js';
import PageLoader from '../components/PageLoader/PageLoader.jsx';
import { adminRoutes, privateRoutes, publicRoutes } from './Routes.js';

const AppRouter = () => {
    const {isAuth, currentUser} = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Аутентификация по VK ID
    useEffect(() => {
        const authenticateUser = async (token) => {
            if (token) {
                await dispatch(authAction());
            }
            setLoading(false);
        };

        const tokenFromStorage = localStorage.getItem('token');
        const vkToken = new URLSearchParams(window.location.search).get('token');

        if (vkToken) localStorage.setItem('token', vkToken);

        authenticateUser(vkToken || tokenFromStorage);
    }, [dispatch]);

    if (loading) return <PageLoader />;

    const renderRoutes = (routes) => routes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
    ));

    const defaultRedirect = currentUser.role === 'admin' ? "/admin" : "/drive";

    return (
        <Routes>
            {isAuth ? (
                <>
                    {currentUser.role === 'admin' && renderRoutes(adminRoutes)}
                    {renderRoutes(privateRoutes)}
                    <Route path="*" element={<Navigate to={defaultRedirect} />} />
                </>
            ) : (
                <>
                    {renderRoutes(publicRoutes)}
                    <Route path="*" element={<Navigate to="/auth" />} />
                </>
            )}
        </Routes>
    );
};

export default AppRouter;
