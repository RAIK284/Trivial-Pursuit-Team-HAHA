import { useState, useEffect } from "react";

const useRegister = () => {
  
  // Username Fetch State
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register State
  const [registerUsername, setRegisterUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  // Username Fetch Function
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: window.localStorage.getItem("token") }),
        });

        const data = await res.json();
        setUsername(data.data.username);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // Register Function
  const handleRegister = async () => {
    setUsernameError("");
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: registerUsername, password }),
      });

      const data = await res.json();
      if (!data.error) {
        setSuccess(true);
        setUsername(registerUsername);
      } else {
        setUsernameError(
          data.error || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setToastSuccess = () => {
    setSuccess(false);
  };

  return {
    username,
    loading,
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
    setToastSuccess
  };
};

export default useRegister;
