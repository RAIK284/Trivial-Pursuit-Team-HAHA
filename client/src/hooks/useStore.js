// Inside your useStore.js or wherever the useStore hook is defined

import { useState, useEffect } from 'react';

const useStore = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true); // Start loading
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
        setLoading(false); // End loading
      } catch (err) {
        console.error(err);
        setLoading(false); // End loading in case of error as well
      }
    };

    getUserInfo();
  }, []);

  return { username, loading }; // Return both username and loading state
};

export default useStore;
