// FeaturesPage.js
import React from 'react';
import FeaturesSection from './FeaturesSection'; // Correct import path, assuming both are in the same folder

function FeaturesPage() {
  return (
    <div>
      <h1>Our Features & Services</h1>
      <FeaturesSection /> {/* Rendering the Features Section */}
    </div>
  );
}

export default FeaturesPage;
