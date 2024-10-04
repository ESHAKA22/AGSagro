import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const navigate = useNavigate();

  const handleCustomOrdersClick = () => {
    navigate('/requests'); // Navigate to the custom request form
  };

  return (
    <section className="features">
      <button className="feature-btn" onClick={handleCustomOrdersClick}>
        <h2>Custom Orders</h2>
      </button>
      <button className="feature-btn">
        <h2>Imported Items</h2>
      </button>
      <button className="feature-btn">
        <h2>Quick Service</h2>
      </button>
    </section>
  );
};

export default Features;
