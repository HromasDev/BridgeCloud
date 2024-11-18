import axios from "axios";
import { logout, setUser } from '../redux/userSlice.js';
const apiUrl = import.meta.env.VITE_API_URL

export const registerAction = async (login, password) => {
    try {
        await axios.post(`${apiUrl}/auth/register`, {
            login,
            password
        });
    } catch (e) {
        return e.response.data.message
    }
};

export const loginAction = (login, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, {
                login,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            dispatch(setUser(response.data));
        } catch (error) {
            console.error('Ошибка входа:', error.response ? error.response.data.message : error.message);
            throw new Error(error.response ? error.response.data.message : "Ошибка входа");
        }
    };
};

export const authAction = () => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/auth/auth`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            dispatch(setUser(response.data));
            localStorage.setItem('token', response.data.token);
        } catch (e) {
            console.error('Auth error:', e.response.data.message);
            localStorage.removeItem('token');
            throw new Error(e.response.data.message);
        }
    };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${apiUrl}/user/${userId}/change-password`, {
            currentPassword,
            newPassword
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data.message;
    } catch (error) {
        console.error('Change password error:', error);
        throw new Error(error.response.data.message);
    }
};

export const changePhoto = async (dispatch, userId, formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${apiUrl}/profile/${userId}/change-photo`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        dispatch(setUser(response.data))

        return response.data.message;
    } catch (error) {
        console.error('Change photo error:', error);
        throw new Error(error.response?.data?.message || "Ошибка при изменении фото");
    }
};


export const changeName = async (dispatch, userId, name) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${apiUrl}/profile/${userId}/change-name`, {
            name
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        dispatch(setUser(response.data));

        return response.data.message;
    } catch (error) {
        console.error('Change name error:', error);
        throw new Error(error.response.data.message);
    }
};

export const accountDelete = async (dispatch, userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${apiUrl}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        dispatch(logout());

        return response.data.message;
    } catch (error) {
        console.error('Account delete error:', error);
        throw new Error(error.response);
    }
};
