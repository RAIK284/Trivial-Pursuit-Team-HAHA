import React from "react";
import registerBackground from "../assets/img/space-planets-bg.jpg";
import "../styles/LoginStyling/LoginForm.css";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div data-testid="register-page" className="login">
      <img alt="background" className="login-bg-img" src={registerBackground} />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
