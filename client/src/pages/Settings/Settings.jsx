import { useDispatch, useSelector } from "react-redux";
import { changePassword as changePasswordAction, accountDelete } from "../../actions/user";
import Section from "../../components/Section/Section";
import SideBar from "../../components/SideBar/SideBar";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import styles from "./Settings.module.css";
import { useState } from "react";

const Settings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({});
    const userId = useSelector((state) => state.user.currentUser.id);
    const dispatch = useDispatch();

    const deleteAccount = async (event) => {
        event.preventDefault();
        await accountDelete(dispatch, userId);
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();
        if (!currentPassword || !newPassword) {
            setMessage({ success: false, "value": "Пожалуйста, заполните все поля." });
            return;
        }

        try {
            await changePasswordAction(userId, currentPassword, newPassword);
            setMessage({ success: true, "value": "Пароль успешно изменен." });
        } catch (err) {
            setMessage({ success: false, "value": err.message || "Произошла ошибка" });
            console.error(err);
        }
    };

    return (
        <div>
            <SideBar />

            <div className={`content ${styles.Settings}`}>
                <h2 className="title">Настройки</h2>
                <Section title="Изменить пароль">
                    <form onSubmit={(event) => handleChangePassword(event)}>
                        <Input
                            id="current-password"
                            placeholder="Ваш пароль"
                            label="Пароль"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Input
                            id="new-password"
                            placeholder="Ваш новый пароль"
                            label="Новый пароль"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span className={`textCenter ${message.success ? 'success' : 'error'}`}>
                            {message.value}
                        </span>
                        <Button type="submit">СОХРАНИТЬ</Button>
                    </form>
                    <Button type="button" onClick={deleteAccount}>УДАЛИТЬ АККАУНТ</Button>
                </Section>
            </div>
        </div>
    );
}

export default Settings;
