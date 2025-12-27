import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL

export const getUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error('getUsers error:', error);
        throw new Error(error.response);
    }
};

export const setUsers = async (users) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`/api/user`, users, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error('setUsers error:', error);
        throw new Error(error.response);
    }
};
