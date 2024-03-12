import React from "react";
import LoginForm from "../components/LoginForm";
import loginBackground from "../assets/img/login-bg.jpg";
import "../styles/LoginStyling/LoginForm.css";

const LoginPage = () => {
  return (
    <div class="login">
      <img alt="background" className="login-bg-img" src={loginBackground} />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
