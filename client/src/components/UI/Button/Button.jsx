import styles from './Button.module.css';

// eslint-disable-next-line react/prop-types
const Button = ({ variant = 'primary', children, ...props }) => {
    const buttonClass = `${styles.Button} ${styles[variant]}`;

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
};

export default Button;
