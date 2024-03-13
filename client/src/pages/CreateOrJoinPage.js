import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

const CreateOrJoinPage = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [room, setRoom] = useState("");

  const getUserInfo = async () => {
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

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageRecieved(data.message);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", room);
    }
  };
  return (
    <div>
      <h1>Welcome {username}</h1>

      <input
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Message..."
      />
      <button onClick={sendMessage}>Send Message</button>
      <input
        onChange={(e) => {
          setRoom(e.target.value);
        }}
        placeholder="Join Room..."
      />
      <button onClick={joinRoom}>Join Room</button>
      <h1>{messageRecieved}</h1>
    </div>
  );
};

export default CreateOrJoinPage;
