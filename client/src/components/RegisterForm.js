import React from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import useRegister from "../hooks/useRegister";

const RegisterForm = () => {
  const [passwordHidden, setpasswordHidden] = React.useState(true);
  const navigate = useNavigate();

  const {
    registerUsername,
    setRegisterUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    usernameError,
    passwordError,
    success,
    handleRegister,
    setToastSuccess,
  } = useRegister();

  return (
    <div className="register-form-container">
      {success && (
        <div data-testid="success-toast" onClick={() => navigate("/login")} className="register-success">
          <FaCircleCheck size={20} />
          Your Account was Successfully Created! Tap here to log in.
          <FaCircleXmark
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              setToastSuccess(false);
            }}
            className="close-nav-toast"
          />
        </div>
      )}
      <form
        data-testid="register-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        className="register-form"
      >
        <h1 className="login-header">Register</h1>
        <div className="input-1">
          <div className="username-container">
            <IoPerson size={18} />
            <input
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              className="username-input"
              placeholder="Username"
              required
            />
          </div>
          <div className="underline" />
          {usernameError && (
            <span data-testid="username-error" className="error-message">{usernameError}</span>
          )}
        </div>
        <div className="input-2">
          <div className="username-container">
            <MdLock size={18} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordHidden ? "password" : "text"}
              className="password-input"
              placeholder="Password"
              required
            />
            <div
              onClick={() => setpasswordHidden(!passwordHidden)}
              className="eye-icon"
            >
              {passwordHidden ? (
                <IoMdEyeOff size={19} />
              ) : (
                <IoMdEye size={19} />
              )}
            </div>
          </div>
          <div className="underline" />
        </div>

        <div>
          <div className="username-container">
            <MdLock size={18} />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={passwordHidden ? "password" : "text"}
              className="password-input"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="underline" />
        </div>
        {passwordError && (
          <span data-testid="password-error" className="error-message">{passwordError}</span>
        )}

        <button
          data-testid="register-button"
          type="submit"
          className="login-button"
        >
          Register
        </button>
        <div className="register-container">
          <span className="have-account">
            Already have an account?{" "}
            <Link style={{ textDecoration: "none" }} to="/login">
              <span className="register">Login</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
