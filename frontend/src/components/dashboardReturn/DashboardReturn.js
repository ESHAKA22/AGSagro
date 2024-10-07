import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Added useParams and useLocation imports
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies to handle customerId
import styles from './DashboardReturn.module.css'; // Remove if not used

function DashboardReturn() {
  const { orderId } = useParams();  // Now useParams is defined
  const location = useLocation();  // Now useLocation is defined
  const history = useNavigate();

  const [formData, setInputs] = useState({
    ordernu: orderId || "",  // Use orderId if it's available
    name: "",
    email: "",
    phone: "",
    image: null,
    qty: "",
    reason: "",
  });

  const customerId = Cookies.get('customerId'); // Retrieve the customerId from the cookie

  useEffect(() => {
    if (location.state && location.state.orderId) {
      setInputs((prevState) => ({
        ...prevState,
        ordernu: location.state.orderId,  // Set the orderId from location state if available
      }));
    }
  }, [location.state]); // Now useEffect is defined

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
        if (!/^\d{0,10}$/.test(value)) {  // Restrict to only 10 digits
          isValid = false;
          alert("Phone number must contain exactly 10 digits.");
        } else if (value.length > 10) {  // Prevent entering more than 10 digits
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
      // Upload the image to Cloudinary
      const imageUrl = await uploadImageToCloudinary();

      // Send the return order data with the customerId
      await sendRequest(imageUrl);
      alert('Return request submitted successfully!');
      history(`/returnOrder`); // Redirect to user profile page after submission
    } catch (error) {
      console.error('Error submitting the return request:', error);
    }
  };

  const uploadImageToCloudinary = async () => {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dqkkx268v/image/upload';
    const uploadPreset = 'agro_preset';

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.image); // Add the image file
    formDataToSend.append('upload_preset', uploadPreset);

    try {
      const cloudinaryResponse = await axios.post(cloudinaryUrl, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log('Cloudinary Response:', cloudinaryResponse.data);
      // Return the URL of the uploaded image
      return cloudinaryResponse.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error; // Rethrow the error to be handled by handleSubmit
    }
  };

  const sendRequest = async (imageUrl) => {
    try {
      const response = await axios.post("http://localhost:8100/returns", {
        customerId: customerId, // Include the customerId with the return order data
        ordernu: formData.ordernu,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        image: imageUrl,
        qty: formData.qty,
        reason: formData.reason,
      });
      console.log("Return request submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting the form:", error);
      throw error; // Rethrow the error to be handled by handleSubmit
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
            onChange={handleChange}
            required
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
              ordernu: '',
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
