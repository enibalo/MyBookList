import PropTypes from "prop-types";
import styles from "../../styles/Book.module.css";

function Alert({ type, message, onClose }) {
  if (!message) return null; // Don't render anything if no message

  return (
    <div
      className={
        type == "error"
          ? styles.alert + " " + styles.error
          : styles.alert + " " + styles.success
      }
    >
      <span>{message}</span>
      <button onClick={onClose} className={styles.close_btn}>
        &times;
      </button>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error"]).isRequired,

  message: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
};
export default Alert;
