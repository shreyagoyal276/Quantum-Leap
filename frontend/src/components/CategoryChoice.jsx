import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CategoryChoice.css';

const CategoryChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="category-page">
      <h1 className="category-title">Choose a Category</h1>
      <div className="category-buttons">
        <button
          className="category-button"
          onClick={() => navigate('/clothing')}
        >
          Clothing
        </button>
        <button
          className="category-button"
          onClick={() => navigate('/dashboard')}
        >
          Food
        </button>
      </div>
    </div>
  );
};

export default CategoryChoice;
