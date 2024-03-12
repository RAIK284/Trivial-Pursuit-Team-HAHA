import React, { useState } from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [passwordHidden, setpasswordHidden] = useState(true);

  return (
    <div className="login-form-container">
        
      <form className="login-form">
        <h1 className="login-header">Login</h1>

        <div class="input-1">
          <div class="username-container">
            <IoPerson size={18} />
            <input className="username-input" placeholder="Username" />
          </div>
          <div className="underline" />
        </div>

        <div class="input-2">
          <div class="username-container">
            <MdLock size={18} />
            <input
              type={passwordHidden ? "password" : "text"}
              className="password-input"
              placeholder="Password"
            />
            <div
              onClick={() => {
                setpasswordHidden(!passwordHidden);
              }}
            >
              {passwordHidden ? (
                <IoMdEyeOff
                  onClick={setpasswordHidden}
                  className="eye-icon-closed"
                  size={19}
                />
              ) : (
                <IoMdEye
                  onClick={setpasswordHidden}
                  className="eye-icon-open"
                  size={19}
                />
              )}
            </div>
          </div>
          <div className="underline" />
        </div>
        <span className="forgot-password">Forgot Password?</span>

        <button className="login-button">Login</button>
        <div className="register-container">
          <span className="no-account">
            Don't have an account? <Link to="/register" className="register">Register</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
