import React, { useState } from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

const RegisterForm = () => {
  const [passwordHidden, setpasswordHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setUsernameError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!data.error) {
        setSuccess(true);
        console.log(success);
        // navigate("/login");
      } else {
        setUsernameError(
          data.error || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.log(err);
    }
    console.log("here", usernameError);
  };

  return (
    <div className="register-form-container">
      {success && (
        <>
          <div
            onClick={() => {
              navigate("/login");
            }}
            className="register-success"
          >
            {" "}
            <FaCircleCheck size={20} /> Your Account was Successfully Created!
            Tap here to log in.{" "}
            <FaCircleXmark
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                setSuccess(false);
              }}
              className="close-nav-toast"
            />
          </div>
        </>
      )}
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="login-header">Register</h1>
        <div className="input-1">
          <div className="username-container">
            <IoPerson size={18} />
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              placeholder="Username"
              required
            />
          </div>

          <div className="underline" />
          {usernameError && (
            <span className="error-message">{usernameError}</span>
          )}
        </div>
        <div className="input-2">
          <div className="username-container">
            <MdLock size={18} />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={passwordHidden ? "password" : "text"}
              className="password-input"
              placeholder="Password"
              required
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

        <div>
          <div className="username-container">
            <MdLock size={18} />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={passwordHidden ? "password" : "text"}
              className="password-input"
              placeholder="Confirm Password
              "
              required
            />
          </div>
          <div className="underline" />
        </div>
        {passwordError && (
          <span className="error-message">{passwordError}</span>
        )}

        <button type="submit" className="login-button">
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
