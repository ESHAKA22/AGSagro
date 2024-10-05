import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductFilter from '../Filters/ProductFilter';
import './Products.css';

axios.defaults.baseURL = 'http://localhost:8070/api/products';

const Products = ({ addToCart }) => { // addToCart function passed as a prop
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/')
      .then((response) => {
        const { data } = response;
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleFilterChange = ({ selectedCategories, priceRange }) => {
    const filtered = products.filter(product => {
      const isWithinPriceRange = product.Price >= priceRange.min && product.Price <= priceRange.max;
      const isInSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes(product.Category);
      return isWithinPriceRange && isInSelectedCategory;
    });
    setFilteredProducts(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const displayedProducts = filteredProducts.filter(product =>
    product.P_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="main-container">
        <div className="filter-container">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="right-side-container">
          <div className="product-search-container">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
          </div>

          <div className="products-container">
            {displayedProducts.map(product => (
              <div className="product-card" key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.P_Image}
                    alt={product.P_name}
                    className="product-image"
                  />
                  <h3>{product.P_name}</h3>
                  <p>Price: Rs. {product.Price.toLocaleString('en-LK')}</p>
                </Link>
                <button 
                  className="add-to-cart-button" 
                  onClick={() => addToCart(product)} // Add to cart when clicked
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
