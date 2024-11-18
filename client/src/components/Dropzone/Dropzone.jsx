import { useDropzone } from 'react-dropzone';
import styles from './Dropzone.module.css';

const Dropzone = ({ onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

    return (
        <div className={styles.DropzoneWrapper}>
            <div
                className={`${styles.Dropzone} ${isDragActive ? styles.active : ''}`}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isDragActive && <p className={styles.text}>Загруза файлов...</p>}
            </div>
        </div>

    );
}

export default Dropzone;
