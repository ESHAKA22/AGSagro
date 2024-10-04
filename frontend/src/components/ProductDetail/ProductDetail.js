import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import Nav from "../Nav/Nav";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/api/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

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
      <button className="add-to-cart-button">Add to Cart</button>
    </div>
    </div>
    
  );
};

export default ProductDetail;
