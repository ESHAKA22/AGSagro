import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ProductFilter from '../Filters/ProductFilter'; // Import the filter component
import './Products.css';

axios.defaults.baseURL = 'http://localhost:8070/api/products';

const Products = () => {
  const [products, setProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [customerId, setCustomerId] = useState(null); // State for storing customer ID

  // Fetch customer ID from cookies
  const getCustomerIdFromCookies = () => {
    const id = document.cookie
      .split('; ')
      .find(row => row.startsWith('customerId='))
      ?.split('=')[1];
    setCustomerId(id);
  };

  useEffect(() => {
    // Fetch products from the backend API
    axios.get('/')
      .then((response) => {
        const { data } = response;
        setProducts(data.products || []); // Set all products
        setFilteredProducts(data.products || []); // Set filtered products
      })
      .catch((error) => console.error('Error:', error));

    // Get customer ID from cookies
    getCustomerIdFromCookies();
  }, []);

  // Handle adding to cart
  const handleAddToCart = async (productId) => {
    if (!customerId) {
      alert('Please log in to add items to your cart.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8070/api/cart/add', {
        productId,
        quantity: 1,
      }, {
        withCredentials: true,  // Ensure credentials (cookies) are sent
      });
  
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = ({ selectedCategories, priceRange }) => {
    const filtered = products.filter(product => {
      const isWithinPriceRange = product.Price >= priceRange.min && product.Price <= priceRange.max;
      const isInSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes(product.Category);
      return isWithinPriceRange && isInSelectedCategory;
    });
    setFilteredProducts(filtered);
  };

  // Handle search term input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on search term and filters
  const displayedProducts = filteredProducts.filter(product =>
    product.P_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="main-container">
        <div className="filter-container">
          {/* Filter Component on the left */}
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="right-side-container">
          {/* Search Bar */}
          <div className="product-search-container">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}  // Handle search input
              className="search-bar"
            />
          </div>

          {/* Product Cards */}
          <div className="products-container">
            {displayedProducts.map(product => (
              <div className="product-card" key={product._id}>
                <Link to={`/products/${product._id}`}> {/* Link to product details */}
                  <img
                    src={product.P_Image}
                    alt={product.P_name}
                    className="product-image"
                  />
                  <h3>{product.P_name}</h3>
                  <p>Price: Rs. {product.Price.toLocaleString('en-LK')}</p>
                </Link>
                {/* Add to Cart Button */}
                <button 
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product._id)} // Call add to cart function
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
