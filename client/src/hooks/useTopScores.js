import { useState, useEffect } from 'react';

const useTopScores = () => {
  const [topScores, setTopScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/top-scores');
        if (!response.ok) {
          throw new Error('Network response invalid');
        }
        const data = await response.json();
        setTopScores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopScores();
  }, []);

  return { topScores, isLoading, error };
};

export default useTopScores;
