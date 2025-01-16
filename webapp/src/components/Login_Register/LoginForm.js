import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase/FirebaseFunctions";
import "./Forms.css";
import logo from "../../assets/logo.png";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const isSuccessful = await loginUser(email, password);
      if (isSuccessful) {
        navigate("/home");
      } else {
        setError("אין לך הרשאות מנהל");
      }
    } catch (err) {
      setError("אירעה שגיאה בהתחברות");
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <div className="logo-image">
        <img src={logo} alt="logo" />
      </div>
      <div className="login-container">
        <h1>התחברות מנהל</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              className="text-input"
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              className="text-input"
              type="password"
              id="password"
              name="password"
              placeholder="הכנס סיסמה"
              dir="rtl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div
              className="error-message"
              style={{ color: "red", textAlign: "center" }}
            >
              {error}
            </div>
          )}
          <button type="submit" className="submit-button">
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
