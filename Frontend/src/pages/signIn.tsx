import { useState, useEffect } from "preact/hooks";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import ongcLogo from "../assets/ONGC-Logo.png";
import assamAirLogo from "../assets/assamAirProductsLogo.png";
import "../css/global.css"; // ✅ Reuse the modern CSS UI we made

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => setLoginError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const getFirebaseErrorMessage = (code: string): string => {
    const errorMap: Record<string, string> = {
      "auth/user-not-found": "No user found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "Invalid email or password. Please try again.",
      "auth/too-many-requests":
      "Access to this account has been temporarily disabled due to many failed login attempts.",
    };
    return errorMap[code] || "An unexpected error occurred. Please try again.";
  };
  
  // ✅ Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset UI states
    setLoginError("");
    setLoading(true);
    try {
      // Config variables
      const persistenceMode = browserLocalPersistence;
      const userEmail = email.trim();
      const userPassword = password;

      // Set persistence
      await setPersistence(auth, persistenceMode);

      // Login attempt
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      const { user } = userCredential;
      console.log("✅ User logged in:", user.uid, user.email);

      // Redirect after success
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("❌ Firebase Login Error:", error);
      const errorCode = error.code as string;
      setLoginError(getFirebaseErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" id={"login-container"}>
      {/* ✅ Error Toast */}
      {loginError && (
        <div className="login-error-container">
          <p className="login-error-text">{loginError}</p>
          <button
            onClick={() => setLoginError("")}
            className="login-close-button"
          >
            <img src={close} alt="close" />
          </button>
        </div>
      )}

      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <div className="login-logos-container">
            <img src={ongcLogo} id={'ongcLogo'} className={'ongcLogo'} alt="" />
            <img src={assamAirLogo} id={'assamAirLogo'} className={'assamAirLogo'} alt="" />

          </div>
          {/* <p>An IOT Data management company</p> */}
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h2>Hello Again!</h2>
          <p>Welcome Back</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-btn"
              id={`login-btn`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
