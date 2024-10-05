import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import Nav from "../Nav/Nav";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // State to manage product quantity
  const [customerId, setCustomerId] = useState(null); // State to store customer ID

  // Fetch product details on component load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/api/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    // Fetch customer ID from cookies
    const getCustomerIdFromCookies = () => {
      const id = document.cookie
        .split('; ')
        .find(row => row.startsWith('customerId='))
        ?.split('=')[1];
      setCustomerId(id);
    };

    fetchProduct();
    getCustomerIdFromCookies();
  }, [id]);

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Handle Add to Cart functionality
  const handleAddToCart = async () => {
    if (!customerId) {
      alert('Please log in to add items to your cart.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/api/cart/add', {
        productId: id,
        quantity: quantity, // Pass the selected quantity
      }, {
        withCredentials: true,  // Ensure credentials (cookies) are sent
      });

      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) return <p>Loading...</p>;

  const stockStatus = product.Quantity > 0 ? "In Stock" : "Out of Stock";
  const stockColor = product.Quantity > 0 ? "green" : "red";

  return (
    <div>
      <Nav />
      <div className="product-detail-container">
        <h2>{product.P_name}</h2>
        <img src={product.P_Image} alt={product.P_name} className="product-detail-image" />
        <p><strong>Manufacturer:</strong> {product.Manufacture}</p>
        <p><strong>Category:</strong> {product.Category}</p>
        <p style={{ color: stockColor }}><strong>Stock Status:</strong> {stockStatus}</p>
        <p><strong>Price:</strong> Rs. {product.Price.toLocaleString('en-LK')}</p>
        <p><strong>Description:</strong> {product.Description}</p>

        {/* Quantity Selector */}
        <div className="quantity-container">
          <button onClick={handleDecreaseQuantity} className="quantity-btn">-</button>
          <span className="quantity">{quantity}</span>
          <button onClick={handleIncreaseQuantity} className="quantity-btn">+</button>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
