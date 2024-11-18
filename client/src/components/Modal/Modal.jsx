import { useState } from 'react';
import styles from './Modal.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

const Modal = (data) => {
    const { modal } = data;

    const [value, setValue] = useState(modal.value ? modal.value : '');

    const handleChange = (value) => {
        setValue(value);
    };

    const handleSubmit = () => {
        modal.onSubmit(value);
        setValue('');
    };

    return (
        <div className={styles.ModalWrapper}>
            <div className={styles.Modal}>
                <div className={styles.ModalHeader}>
                    <h2>{modal.header}</h2>
                </div>
                <div className={styles.ModalBody}>
                    <Input
                        id="input-name"
                        placeholder={modal.placeholder}
                        value={value}
                        setValue={handleChange}
                    />
                </div>
                <div className={styles.ModalFooter}>
                    <Button variant='primary' type='submit' onClick={handleSubmit}>Создать</Button>
                    <Button variant='secondary' type='button' onClick={() => modal.onSubmit(null)}>Отмена</Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
