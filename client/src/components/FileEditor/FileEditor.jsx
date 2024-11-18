import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFileData, saveFileData } from '../../actions/file';
import { setCurrentPath } from '../../redux/storageSlice';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';
import styles from './FileEditor.module.css';

const FileEditor = ({ isEditing, setIsEditing, currentPath }) => {
    const dispatch = useDispatch();
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(isEditing);
    const [isLoading, setIsLoading] = useState(false);

    const storedFile = useSelector(
        (state) => state.storage.files.find((f) => f.document_id === file?.document_id)
    );

    useEffect(() => {
        if (isEditing) {
            if (storedFile.document_id) {
                if (storedFile?.data) {
                    setFileData(storedFile.data);
                } else if (file) {
                    const fetchData = async () => {
                        setIsLoading(true);
                        try {
                            const newFileData = await getFileData(dispatch, file);
                            setFileData(newFileData.data);
                        } catch (error) {
                            console.error("Ошибка загрузки данных файла:", error);
                        } finally {
                            setIsLoading(false);
                        }
                    };
                    fetchData();
                }
            } else {
                setFileData('');
            }
        }
    }, [file, storedFile, dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsEditing(null);

        const newPath = currentPath.slice(0, -1);
        dispatch(setCurrentPath(newPath));

        await saveFileData(dispatch, { document_id: storedFile?.document_id, data: fileData });
    };

    return (
        <div>
            {isLoading || fileData === null ? (
                <Spinner />
            ) : (
                <form className={styles.editing} onSubmit={handleSubmit}>
                    <p style={{ paddingBottom: '10px' }}>Содержание файла:</p>
                    <div className={styles.wrapper_editor}>
                        <textarea
                            className={styles.editor}
                            value={fileData}
                            onChange={(event) => setFileData(event.target.value)}
                        />
                    </div>
                    <Button type="submit">Сохранить</Button>
                </form>
            )}
        </div>
    );
};

export default FileEditor;
