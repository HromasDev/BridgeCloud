import styles from './AuthHeader.module.css';
const apiUrl = import.meta.env.VITE_API_URL

const Header = ({ title, subtitle }) => {
    return (
        <div className={styles.Header}>
            <img className={styles.logo} src="logo.svg" alt="Logo" />
            <h2>{title}</h2>
            <span className='subtitle'>{subtitle}</span>
        </div>
    );
};

export default Header;
