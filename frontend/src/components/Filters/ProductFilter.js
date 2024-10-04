import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000000 });

  const categories = [
    'Engine Components', 'Transmission & Drivetrain', 'Hydraulic System', 
    'Electrical System', 'Fuel System', 'Steering & Suspension', 'Brakes', 
    'Cooling System', 'Exhaust System', 'Body & Cab Components', 'Tires & Wheels', 
    'Filters & Maintenance Parts', 'Implements & Attachments', 'Safety & Accessories', 'Other'
  ];

  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    onFilterChange({ selectedCategories: newSelectedCategories, priceRange });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({ ...priceRange, [name]: value });
    onFilterChange({ selectedCategories, priceRange: { ...priceRange, [name]: value } });
  };

  return (
    <div className="filter-container">
      <h3>Filter by Price</h3>
      <div className="price-range">
        <label>Rs.</label>
        <input
          type="number"
          name="min"
          value={priceRange.min}
          onChange={handlePriceChange}
          placeholder="Min"
        />
        <label> to </label>
        <input
          type="number"
          name="max"
          value={priceRange.max}
          onChange={handlePriceChange}
          placeholder="Max"
        />
      </div>

      <h3>Filter by Category</h3>
      <div className="category-list">
        {categories.map((category) => (
          <div key={category}>
            <input
              type="checkbox"
              id={category}
              value={category}
              onChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
