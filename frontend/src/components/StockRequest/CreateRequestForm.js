import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateRequestForm.css'; // Import your CSS for styling

const CreateRequestForm = ({ onClose, onRequestCreated }) => {
  const [newRequest, setNewRequest] = useState({ productId: '', supplierId: '', quantity: 1 });
  const [error, setError] = useState(null);
  const [productSuggestions, setProductSuggestions] = useState([]); // State for product suggestions

  useEffect(() => {
    if (newRequest.productId) {
      fetchProductSuggestions(newRequest.productId); // Fetch suggestions when the input changes
    } else {
      setProductSuggestions([]); // Clear suggestions if input is empty
    }
  }, [newRequest.productId]);

  const fetchProductSuggestions = async (query) => {
    try {
      const response = await axios.get(`http://localhost:8070/api/products/search?search=${query}`); // Updated API for fetching products
      setProductSuggestions(response.data); // Set product suggestions
    } catch (err) {
      console.error('Error fetching product suggestions:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const createRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8070/api/stockrequests/requests', newRequest);
      onRequestCreated(); // Call the function to refresh requests
      onClose(); // Close the modal
      setNewRequest({ productId: '', supplierId: '', quantity: 1 }); // Reset fields
    } catch (err) {
      setError('Error creating request. Please check your inputs.');
    }
  };

  const handleSuggestionClick = (productId) => {
    setNewRequest({ ...newRequest, productId });
    setProductSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="modal-title">Create New Stock Request</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="request-form" onSubmit={createRequest}>
        <div className="form-group">
          <label htmlFor="productId">Product ID</label>
          <input
            type="text"
            name="productId"
            placeholder="Enter Product ID"
            value={newRequest.productId}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          {productSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {productSuggestions.map((product) => (
                <li key={product.id} onClick={() => handleSuggestionClick(product.id)}>
                  {product.id} - {product.name} {/* Displaying product name for better context */}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="supplierId">Supplier ID</label>
          <input
            type="text"
            name="supplierId"
            placeholder="Enter Supplier ID"
            value={newRequest.supplierId}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter Quantity"
            value={newRequest.quantity}
            min="1"
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Create Request</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm;
