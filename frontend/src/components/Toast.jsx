
import "./Toast.css"

function Toast({ message, type = "success", onClose }) {
    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-indicator"></div>

            <div className="toast-content">
                <strong>
                    {type === "success" ? "SUCCESS" : "ERROR"}
                </strong>

                <span>{message}</span>
            </div>

            <button onClick={onClose}>
                ×
            </button>
        </div>
    );
}

export default Toast;