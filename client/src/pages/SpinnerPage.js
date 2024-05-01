import React, { useState } from 'react';
import "../styles/SpinnerPage.css"; 
import english from '../assets/img/english.png';
import geography from '../assets/img/geography.png';
import art from '../assets/img/art.png';
import science from '../assets/img/science.png';
import sports from '../assets/img/sports.png';
import history from '../assets/img/history.png';
import spinnerBackground from '../assets/img/spinnerPage.png';

const categoriesData = [
  { name: 'English', image: english, color: '#FFD700' },
  { name: 'Geography', image: geography, color: '#FF6347' },
  { name: 'Art', image: art, color: '#6A5ACD' },
  { name: 'Science', image: science, color: '#20B2AA' },
  { name: 'Sports', image: sports, color: '#FF4500' },
  { name: 'History', image: history, color: '#DA70D6' },
];

const SpinnerPage = () => {
  const [categories, setCategories] = useState(categoriesData);
  const [spinAngle, setSpinAngle] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('');

  const spin = () => {
    if (categories.length === 0) {
      alert("All categories have been chosen!");
      return;
    }
    const newAngle = Math.floor(Math.random() * 360) + 720;
    setSpinAngle(prev => {
      const updatedAngle = prev + newAngle;
      setTimeout(() => {
        const totalDegrees = updatedAngle % 360;
        const degreesPerCategory = 360 / categories.length;
        const selectedCategoryIndex = Math.floor(totalDegrees / degreesPerCategory);
        const selectedCategory = categories[selectedCategoryIndex];
        setCurrentCategory(selectedCategory.name);

        const newCategories = categories.filter((category, index) => index !== selectedCategoryIndex);
        setCategories(newCategories);

        alert(`You landed on ${selectedCategory.name}!`);
      }, 2000); 
      return updatedAngle;
    });
  };

  return (
    <div className="spinner-container" style={{ backgroundImage: `url(${spinnerBackground})` }}>
      <div className="title-container">
        {currentCategory && <h1>{currentCategory}</h1>}
      </div>
      <div className="spinner" onClick={spin} style={{ transform: `rotate(${spinAngle}deg)`, transition: 'transform 2s cubic-bezier(.33, .67, .66, 1)' }}>
        {categories.map((category, index) => (
          <div key={category.name} className={`slice ${category.name.toLowerCase()}`} style={{
            transform: `rotate(${index * (360 / categories.length)}deg)`,
            backgroundColor: category.color
          }}>
        <img src={category.image} alt={`${category.name} logo`} className="logo" />
      </div>
    ))}
  </div>
      <div className="pointer"></div>
    </div>
  );
};

export default SpinnerPage;
