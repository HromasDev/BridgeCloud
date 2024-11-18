import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({ label, id, setValue, ...props }) => {
    return (
        <>
            {label && <label className={styles.Label} htmlFor={id}>{label}</label>}
            <input id={id} className={styles.Input} onChange={(e) => setValue(e.target.value)} {...props} />
        </>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired
};

export default Input;
