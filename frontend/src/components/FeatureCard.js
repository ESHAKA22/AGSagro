import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/FeatureCard.css'; // Import CSS file for styling

const FeatureCard = ({ image, title, description, link }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    // Navigate to the provided link
    navigate(link);
  };

  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="see-more-btn" onClick={handleSeeMore}>See More</button>
    </div>
  );
};

export default FeatureCard;
