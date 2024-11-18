import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL

const useServerConnection = () => {
    const [isServerConnected, setIsServerConnected] = useState(null);

    useEffect(() => {
        const checkServerConnection = async () => {
            try {
                const response = await fetch(`${apiUrl}/status`);
                if (response.ok) {
                    setIsServerConnected(true);
                } else {
                    setIsServerConnected(false);
                    callback("Сервер недоступен");
                }
            } catch (error) {
                setIsServerConnected(false);
            }
        };

        checkServerConnection();
    }, []);

    return isServerConnected;
};

export default useServerConnection;
