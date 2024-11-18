import axios from 'axios';
import { addFile, addFolder, clearProgress, moveFile, removeFile, removeFolder, renameFile, renameFolder, setFiles, setFolders, setLoading, setProgress, updateFileData } from '../redux/storageSlice.js';
const apiUrl = import.meta.env.VITE_API_URL

export const getFiles = async (dispatch) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${apiUrl}/file`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        dispatch(setFolders(response.data.folders));
        dispatch(setFiles(response.data.files));

        return response.data;
    } catch (error) {
        console.error('Ошибка получения файлов:', error);
    }
};

export const createFile = async (dispatch, name, type, currentFolder) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${apiUrl}/file/new`, {
            name,
            type,
            folder: currentFolder,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        type === 'folder' ? dispatch(addFolder(response.data.file)) : dispatch(addFile(response.data.file));

        return response.data;
    } catch (error) {
        console.error('Ошибка создания:', error);
    }
};


export const uploadFiles = async (dispatch, acceptedFiles, currentFolder) => {
    const token = localStorage.getItem('token');

    if (!Array.isArray(acceptedFiles)) {
        console.error('acceptedFiles is not an array:', acceptedFiles);
        return;
    }

    dispatch(setLoading(true));


    const uploadPromises = acceptedFiles.map((file, index) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('folder', currentFolder);

        return axios.post(`${apiUrl}/file`, formData, {
            onUploadProgress: (progressEvent) => {
                const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch(setProgress({ index: index, name: file.name, progress: percentComplete }));
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
    });

    try {
        const responses = await Promise.all(uploadPromises); // Ожидаем завершения всех загрузок

        responses.forEach(response => {
            response.data.files.forEach(file => dispatch(addFile(file)));
        });

    } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
    } finally {
        dispatch(clearProgress());
    }
};


export const deleteFiles = async (dispatch, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${apiUrl}/file`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: data
        });


        data.files.forEach(file => {
            file.type === 'folder' ? dispatch(removeFolder(file._id)) : dispatch(removeFile(file._id))
        });


        return response.data;
    } catch (error) {
        console.error('Ошибка удаления файлов:', error);
    }
};

export const deleteFolders = async (dispatch, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${apiUrl}/file`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: data
        });

        data.files.forEach(file => dispatch(removeFolder(file)))


        return response.data;
    } catch (error) {
        console.error('Ошибка удаления файлов:', error);
    }
};

export const rename = async (dispatch, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${apiUrl}/file/rename`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        data.type === 'folder' ? dispatch(renameFolder(response.data.file)) : dispatch(renameFile(response.data.file))

        return response.data;
    } catch (error) {
        console.error('Ошибка редактирования файлов:', error);
    }
};

export const moveFiles = async (dispatch, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${apiUrl}/file/move`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });


        const { files, folder } = data;
        files.forEach(fileId => {
            dispatch(moveFile({ _id: fileId, folderId: folder }));
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка редактирования файлов:', error);
    }
};

export const getFileData = async (dispatch, file) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${apiUrl}/file/${file.document_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка получения файлов:', error);
    }
};

export const saveFileData = async (dispatch, data) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.put(`${apiUrl}/file`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        dispatch(updateFileData({old_data: data, new_data: response.data.file}));

        return response.data;
    } catch (error) {
        console.error('Ошибка получения файлов:', error);
    }
};
