import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../actions/user.js';
import Header from '../../components/AuthHeader/AuthHeader.jsx';
import Button from '../../components/UI/Button/Button.jsx';
import Input from '../../components/UI/Input/Input.jsx';
import useServerConnection from '../../hooks/useServerConnection.js';
import styles from './Auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isServerConnected = useServerConnection();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await dispatch(loginAction(login, password));
            setError("");
        } catch (err) {
            setError(err.message || "Произошла ошибка");
        }
    };

    const handleVKLogin = () => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=51761794&display=popup&redirect_uri=${import.meta.env.VITE_API_URL}/auth/vk-auth&response_type=code&v=5.120`;
    };

    return (
        <div className={styles.Auth}>
            <form onSubmit={handleLogin}>
                <Header
                    title="Войти в Bridge"
                    subtitle="Введите свой логин и пароль, либо авторизируйтесь через VK"
                />

                <Input
                    id="login"
                    placeholder="Ваш логин"
                    label="Логин"
                    value={login}
                    setValue={setLogin}
                    disabled={!isServerConnected}
                />
                <Input
                    id="password"
                    placeholder="Ваш пароль"
                    label="Пароль"
                    type="password"
                    value={password}
                    setValue={setPassword}
                    disabled={!isServerConnected}
                />


                {error && <span className='textCenter error'>{error}</span>}

                {!isServerConnected && <span className='textCenter error'>Ошибка соединения с сервером</span>}

                <Button variant="secondary" type="button" onClick={() => navigate('/register')}>
                    ЕЩЕ НЕ ЗАРЕГИСТРИРОВАНЫ?
                </Button>

                <Button type="submit" disabled={!isServerConnected}>
                    ВОЙТИ
                </Button>

                <Button variant="primary" type="button" onClick={handleVKLogin} disabled={!isServerConnected}>
                    АВТОРИЗОВАТЬСЯ ПО VK ID
                </Button>
            </form>
        </div>
    );
};

export default Login;
