import React, { useEffect, useState } from "react";


const CreateOrJoinPage = () => {

  const[username, setUsername] = useState('');

  const getUserInfo = async () => {
  
    console.log("here")
    try {
      const res = await fetch("http://localhost:5000/userData", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ token: window.localStorage.getItem("token") }),
      });
  
      const data = await res.json();
      console.log(data, "dynamicUserInfo");
      setUsername(data.data.username);
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <h1>Welcome {username}</h1>
    </div>
  );
};

export default CreateOrJoinPage;
