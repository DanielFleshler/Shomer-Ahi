/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../firebase/FirebaseFunctions";
import "./Forms.css";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isRegistered = await registerUser(email, password, getFormData());
    console.log(isRegistered);
    if (isRegistered) {
      navigate("/login");
    }
  };
  return (
    <div className="register-container">
      <h1>הרשמה</h1>
      <form id="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            dir="ltr"
            className="ltr-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password (8+ characters)"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">אימות סיסמה</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter password"
            dir="ltr"
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">שם פרטי</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="הכנס שם פרטי"
            dir="rtl"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">שם משפחה</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="הכנס שם משפחה"
            dir="rtl"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">מספר טלפון</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="05XXXXXXXX"
            dir="ltr"
          />
        </div>
        <div className="form-group">
          <label htmlFor="licenseNumber">מספר רישיון</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            placeholder="הכנס מספר רישיון"
            dir="rtl"
          />
        </div>
        <div className="form-group">
          <label htmlFor="licensePhoto">צילום רישיון</label>
          <div className="file-input-container">
            <input
              type="file"
              id="licensePhoto"
              name="licensePhoto"
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="licensePhoto" className="file-input-label">
              העלה תמונת רישיון
            </label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          הרשם
        </button>
        <p>
          ?כבר יש לך חשבון
          <Link to="/login" className="login-link">
            התחבר
          </Link>
        </p>
      </form>
    </div>
  );
}

function getFormData() {
  const form = document.getElementById("register-form");
  const userData = {
    email: form.email.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    phoneNumber: form.phoneNumber.value,
    licenseNumber: form.licenseNumber.value,
    licensePhoto: form.licensePhoto.files[0],
    isUserValid: false,
  };
  return userData;
}

export { RegisterForm as default, getFormData };*/
