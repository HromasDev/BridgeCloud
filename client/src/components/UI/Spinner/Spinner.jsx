import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.Spinner}>
      <div className={styles.SpinnerCircle}></div>
    </div>
  );
};

export default Spinner;
