import React, { useState } from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
const LoginForm = () => {
  const [passwordHidden, setpasswordHidden] = useState(true);
  const { setUsername, setPassword, error, handleSubmit } = useLogin();

  return (
    <div className="login-form-container">
      <div className="trivial-pursuit">Trivial Pursuit</div>
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-header">Login</h1>
        <div className="input-1">
          <div className="username-container">
            <IoPerson size={18} />
            <input
              required
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              placeholder="Username"
            />
          </div>
          <div className="underline" />
        </div>

        <div className="input-2">
          <div className="username-container">
            <MdLock size={18} />
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
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
          {error && <div className="error-message">{error}</div>}
        </div>
        <span className="forgot-password">Forgot Password?</span>

        <button type="submit" className="login-button">
          Login
        </button>

        <div className="register-container">
          <span className="no-account">
            Don't have an account?{" "}
            <Link to="/register" className="register">
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
