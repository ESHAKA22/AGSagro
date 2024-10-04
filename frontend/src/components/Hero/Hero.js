import React from 'react';
import './Hero.css';
import index1 from '../../assets/images/index1.jpg'; // Correct path

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        
        <img src={index1} alt="Agricultural Equipment" className="hero-image" />
      </div>
    </section>
  );
};

export default Hero;
