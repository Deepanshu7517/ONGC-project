import { useNavigate } from "react-router-dom";
import "../css/global.css"; // Make sure to import your new CSS file

const ErrorElement = ({ goTo }: { goTo: string }) => {
  const navigate = useNavigate();
  return (
    <div className="error-container">
      <div className="error-card">
        {/* Error Icon */}
        <div className="error-icon-wrapper">
          <span className="error-icon-text">⚠️</span>
        </div>

        {/* Message */}
        <h1 className="error-title">
          Invalid URL
        </h1>
        <p className="error-message">
          You have entered a wrong URL. Please go back to previous page.
        </p>

        {/* Button */}
        <button
          onClick={() => {
            navigate(goTo);
          }}
          className="error-button"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorElement;