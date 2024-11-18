import styles from './Section.module.css'

const Section = ({ title, children }) => {
    return (
        <div className={styles.Section}>
            <p>{title}</p>
            <hr />
            {children}
        </div>
    )
}

export default Section