import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './AddProduct.module.css';
import Nav from "../Nav/Nav";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    P_name: '',
    Category: '',
    Manufacture: '',
    Price: '',
    Quantity: '',
    Description: '',
    Supplier_ID: '',
    P_Image: null
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  const [categories] = useState([
    'Engine Components', 'Transmission & Drivetrain', 'Hydraulic System',
    'Electrical System', 'Fuel System', 'Steering & Suspension', 'Brakes',
    'Cooling System', 'Exhaust System', 'Body & Cab Components', 'Tires & Wheels',
    'Filters & Maintenance Parts', 'Implements & Attachments', 'Safety & Accessories', 'Other'
  ]);

  const navigate = useNavigate(); // Initialize navigate for redirection

  const validateForm = () => {
    const newErrors = {};
    if (!productData.P_name.trim()) newErrors.P_name = 'Product Name is required';
    if (!productData.Category) newErrors.Category = 'Please select a category';
    if (!productData.Manufacture.trim()) newErrors.Manufacture = 'Manufacture is required';
    if (!productData.Price || productData.Price <= 0) newErrors.Price = 'Price must be a positive number';
    if (!productData.Quantity || productData.Quantity < 0) newErrors.Quantity = 'Quantity must be 0 or more';
    if (productData.Description.trim().length < 10) newErrors.Description = 'Description must be at least 10 characters';
    if (!productData.Supplier_ID.trim()) newErrors.Supplier_ID = 'Supplier ID is required';
    if (!productData.P_Image) newErrors.P_Image = 'Please upload an image';
    else {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(productData.P_Image.type)) newErrors.P_Image = 'Only JPEG and PNG images are allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, P_Image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    const formData = new FormData();
    formData.append('P_name', productData.P_name);
    formData.append('Category', productData.Category);
    formData.append('Manufacture', productData.Manufacture);
    formData.append('Price', productData.Price);
    formData.append('Quantity', productData.Quantity);
    formData.append('Description', productData.Description);
    formData.append('Supplier_ID', productData.Supplier_ID);
    formData.append('P_Image', productData.P_Image);

    try {
      const response = await axios.post('http://localhost:8070/api/products/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Product added successfully:', response.data);
      
      // Navigate to product view page after successful creation
      navigate('/ProductView'); // Change the route to your product view page
    } catch (error) {
      console.error('Error adding product:', error.response.data);
    }
  };

  return (
    <div>      
      <Nav/>
      <div className="container">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="P_name"
              className="form-control"
              value={productData.P_name}
              onChange={handleChange}
              required
            />
            {errors.P_name && <p className="error">{errors.P_name}</p>}
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="Category"
              className="form-control"
              value={productData.Category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.Category && <p className="error">{errors.Category}</p>}
          </div>
          <div className="form-group">
            <label>Manufacture</label>
            <input
              type="text"
              name="Manufacture"
              className="form-control"
              value={productData.Manufacture}
              onChange={handleChange}
              required
            />
            {errors.Manufacture && <p className="error">{errors.Manufacture}</p>}
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="Price"
              className="form-control"
              value={productData.Price}
              onChange={handleChange}
              required
            />
            {errors.Price && <p className="error">{errors.Price}</p>}
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="Quantity"
              className="form-control"
              value={productData.Quantity}
              onChange={handleChange}
              required
            />
            {errors.Quantity && <p className="error">{errors.Quantity}</p>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="Description"
              className="form-control"
              value={productData.Description}
              onChange={handleChange}
              required
            ></textarea>
            {errors.Description && <p className="error">{errors.Description}</p>}
          </div>
          <div className="form-group">
            <label>Supplier ID</label>
            <input
              type="text"
              name="Supplier_ID"
              className="form-control"
              value={productData.Supplier_ID}
              onChange={handleChange}
              required
            />
            {errors.Supplier_ID && <p className="error">{errors.Supplier_ID}</p>}
          </div>
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              name="P_Image"
              className="form-control"
              onChange={handleImageChange}
              required
            />
            {errors.P_Image && <p className="error">{errors.P_Image}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
