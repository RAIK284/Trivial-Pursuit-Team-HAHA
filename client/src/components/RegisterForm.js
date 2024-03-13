import React, { useState } from "react";
import "../styles/LoginStyling/LoginForm.css";
import { IoPerson } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [passwordHidden, setpasswordHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {

    console.log(username)
    console.log(password)
    console.log(confirmPassword)
    console.log(' ')

    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.status === 400 || res.status === 500) {
        setError(data.message);
      } else {
        console.log(data)
      }
    } catch (err) {
      setError("Failed to register");
    }
  };

  return (
    <div className="login-form-container">
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
        {error && <span className="error-message">{error}</span>}

        <button type="submit" className="login-button">
          Register
        </button>
        <div className="register-container">
          <span className="have-account">
            Already have an account?{" "}
            <Link to="/login" className="register">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
