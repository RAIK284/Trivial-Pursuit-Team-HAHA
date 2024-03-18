import React from 'react';
import "../styles/CreateOrJoinPage.css"
// Harley here test 

const CreateOrJoinPage = () => {
  return (
    <div className="create-or-join-page">
      <h1>Welcome to the Game Portal</h1>
      <div className="buttons-container">
        <button className="create-button">Create a Game</button>
        <button className="join-button">Join a Game</button>
      </div>
    </div>
  );
};

export default CreateOrJoinPage;
