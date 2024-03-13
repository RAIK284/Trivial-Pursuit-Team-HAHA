import React from "react";
import loginBackground from "../assets/img/login-bg.jpg";
import "../styles/LoginStyling/LoginForm.css";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div class="login">
      <img alt="background" className="login-bg-img" src={loginBackground} />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
