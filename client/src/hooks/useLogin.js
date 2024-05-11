import { useState } from "react";

const useLogin = () => {
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
        window.localStorage.setItem("token", data.data);
        window.location.href = "./create-or-join-game";
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
  };
};
export default useLogin;
