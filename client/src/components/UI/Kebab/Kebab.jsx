import styles from './KebabMenu.module.css';

const KebabMenu = ({onClick}) => {
    return (
        <div className={styles.kebabWrapper} onClick={onClick}>
            <div className={styles.kebab}>
                <div className={`${styles.middle}`}>
                    <figure></figure>
                    <figure></figure>
                    <figure></figure>
                </div>
            </div>
        </div>
    );
};

export default KebabMenu;
