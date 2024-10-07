import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ordernu: '',
    name: '',
    email: '',
    phone: '',
    image: '',
    qty: '',
    reason: ''
  });

  useEffect(() => {
    const fetchReturnData = async () => {
      try {
        const response = await axios.get(`http://localhost:8100/returns/${id}`);
        setFormData(response.data.returns || {});
      } catch (error) {
        console.error("Error fetching return data:", error);
      }
    };

    fetchReturnData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let isValid = true;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prevState) => ({
          ...prevState,
          image: file,
        }));
      }
      return;
    }

    switch (name) {
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
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all fields correctly.");
      return;
    }

    let imageUrl = formData.image;

    if (formData.image instanceof File) {
      imageUrl = await uploadImageToCloudinary();
    }

    // Submit form data with the image URL
    await sendRequest(imageUrl);
    navigate('/returnOrder'); // Navigate to returnOrder after submission
  };

  const validateForm = () => {
    const {  name, email, phone, qty, reason, image } = formData;

    // Check if all fields are filled
    if ( !name || !email || !phone || !qty || !reason) {
      alert("All fields must be filled in.");
      return false;
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Check if the image is either a file or a URL
    if (!image || (image instanceof File && image.size === 0)) {
      alert("Please upload a valid image.");
      return false;
    }

    return true;
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

      return cloudinaryResponse.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  const sendRequest = async (imageUrl) => {
    try {
      await axios.put(`http://localhost:8100/returns/${id}`, {
        ordernu: formData.ordernu, // Ensure that order number remains the same
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        image: imageUrl || formData.image, // Use the uploaded image or existing URL
        qty: formData.qty,
        reason: formData.reason
      });
    } catch (error) {
      console.error("Error updating return data:", error);
    }
  };

  return (
    <div className="container">
      <h1>Update Return Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Number:</label>
          <input
            type="text"
            name="ordernu"
            value={formData.ordernu}
            readOnly // Make the Order Number read-only to prevent user edits
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
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Update;
