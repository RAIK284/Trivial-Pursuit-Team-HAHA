import React, { useState } from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [passwordHidden, setpasswordHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login-user", {
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
      console.log(data, "userLogin");
      if (data.status === "ok") {
        alert("Login Successful");
        window.localStorage.setItem("token", data.data);
        window.location.href = "./create-or-join-game";
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-form-container">
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
