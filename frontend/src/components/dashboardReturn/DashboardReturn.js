import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './DashboardReturn.module.css';

function DashboardReturn() {
  const { orderId } = useParams();
  const location = useLocation();
  const history = useNavigate();

  const [formData, setInputs] = useState({
    ordernu: orderId || generateUniqueOrderId(), // Generate order ID if not provided
    name: "",
    email: "",
    phone: "",
    image: null,
    qty: "",
    reason: "",
  });

  const customerId = Cookies.get('customerId');

  // Function to generate a unique order ID using a timestamp and customer ID
  const generateUniqueOrderId = () => {
    const timestamp = Date.now();
    return `ORD-${customerId}-${timestamp}`;
  };

  useEffect(() => {
    if (location.state && location.state.orderId) {
      setInputs((prevState) => ({
        ...prevState,
        ordernu: location.state.orderId,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let isValid = true;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setInputs((prevState) => ({
          ...prevState,
          image: file,
        }));
      }
      return;
    }

    switch (name) {
      case 'ordernu':
        if (!/^\d+$/.test(value)) {
          isValid = false;
          alert("Order number must be numeric.");
        }
        break;
      case 'name':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          isValid = false;
          alert("Name must contain only letters.");
        }
        break;
      case 'qty':
        if (value <= 0 || isNaN(value)) {
          isValid = false;
          alert("Quantity must be a positive number.");
        }
        break;
      case 'phone':
        if (!/^\d{0,10}$/.test(value)) {
          isValid = false;
          alert("Phone number must contain exactly 10 digits.");
        } else if (value.length > 10) {
          isValid = false;
          alert("Phone number cannot be more than 10 digits.");
        }
        break;
      default:
        break;
    }

    if (isValid) {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ordernu || !formData.name || !formData.email || !formData.phone || !formData.qty || !formData.reason || !formData.image) {
      alert("Please fill all fields correctly.");
      return;
    }
    try {
      const imageUrl = await uploadImageToCloudinary();
      await sendRequest(imageUrl);
      alert('Return request submitted successfully!');
      history(`/returnOrder`);
    } catch (error) {
      console.error('Error submitting the return request:', error);
    }
  };

  const uploadImageToCloudinary = async () => {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dqkkx268v/image/upload';
    const uploadPreset = 'agro_preset';

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.image);
    formDataToSend.append('upload_preset', uploadPreset);

    try {
      const cloudinaryResponse = await axios.post(cloudinaryUrl, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return cloudinaryResponse.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const sendRequest = async (imageUrl) => {
    try {
      await axios.post("http://localhost:8070/returns", {
        customerId: customerId,
        ordernu: formData.ordernu,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        image: imageUrl,
        qty: formData.qty,
        reason: formData.reason,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Return Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Number:</label>
          <input
            type="text"
            name="ordernu"
            value={formData.ordernu}
            readOnly // Make the Order Number field read-only
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className='confirm-button'>Confirm Request</button>
          <button
            type="button"
            className='cancel-button'
            onClick={() => setInputs({
              ordernu: generateUniqueOrderId(), // Reset to a new order ID if user cancels
              name: '',
              email: '',
              phone: '',
              image: null,
              qty: '',
              reason: '',
            })}
          >Cancel Request</button>
        </div>
      </form>
    </div>
  );
}

export default DashboardReturn;
