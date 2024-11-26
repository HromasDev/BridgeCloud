import { faClock, faGear, faHouse, faMoon, faRightFromBracket, faStar, faSun, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { changeName, changePhoto } from '../../actions/user';
import { logout } from '../../redux/userSlice';
import styles from './SideBar.module.css';

const SideBar = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem('darkTheme') === 'true');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.currentUser);
    const [userName, setUserName] = useState(user.name);

    const fileInputRef = useRef(null);

    const handleLogout = async (e) => {
        e.preventDefault();
        await dispatch(logout());
        navigate('/auth');
    };

    const handleNameChange = async (e) => {
        e.preventDefault();
        await changeName(dispatch, user.id, e.target.value);
    }

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await changePhoto(dispatch, user.id, formData);
        } catch (error) {
            console.error("Ошибка при изменении фото:", error);
        }
    };


    useEffect(() => {
        document.body.classList.toggle('dark-theme', isDarkTheme);
    }, [isDarkTheme]);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('darkTheme', newTheme);
    };

    return (
        <div className={styles.SideBar}>
            <div className={styles.topContent}>
                <div className={styles.user_photoWrapper}>
                    <img
                        className={styles.user_photo}
                        srcSet={user.photo || "default_photo.png"}
                        alt=""
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className={styles.avatarInput}
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />
                    <div
                        className={styles.avatarOverlay}
                        onClick={() => fileInputRef.current.click()}
                        style={{ cursor: 'pointer' }}
                    >
                        +
                    </div>
                </div>

                <div className={styles.user_info}>
                    <input
                        className={styles.user_name}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onBlur={handleNameChange}
                    />
                    <span className={styles.user_role}>
                        {user.role === 'user' && "Пользователь"}
                        {user.role === 'admin' && "Администратор"}
                    </span>
                </div>
            </div>

            <div className={styles.menu}>
                <Link to="/drive">
                    <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                    <span>Главная</span>
                </Link>
            </div>
            <div className={styles.bottomContent}>
                <Link to="/drive" className={styles.mobileLink}>
                    <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                    <span>Главная</span>
                </Link>
                {user.role === 'admin' && (
                    <Link to="/admin">
                        <FontAwesomeIcon icon={faUserTie} className={styles.icon} />
                        <span>Админ-панель</span>
                    </Link>
                )}
                <Link to="/settings">
                    <FontAwesomeIcon icon={faGear} className={styles.icon} />
                    <span>Настройки</span>
                </Link>
                <a onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className={styles.icon} />
                    <span>Выход</span>
                </a>
                <div className={styles.themeTogglerButton} onClick={toggleTheme}>
                    <FontAwesomeIcon icon={isDarkTheme ? faMoon : faSun} className={styles.icon} />
                    <span className={styles.modeText}>{isDarkTheme ? 'Светлая' : 'Тёмная'} тема</span>
                    <div className={`${styles.toggleSwitch} ${isDarkTheme ? styles.active : ''}`}>
                        <div className={`${styles.switch} ${isDarkTheme ? styles.active : ''}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
