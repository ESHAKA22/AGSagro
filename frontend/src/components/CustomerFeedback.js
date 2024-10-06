import React, { useState } from 'react';
import axios from 'axios';

export default function CustomerFeedback() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [hearAboutUs, setHearAboutUs] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [serviceRating, setServiceRating] = useState('');
  const [comments, setComments] = useState('');

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    let errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(phone)) {
      errors.phone = 'Phone number is invalid. Only digits are allowed.';
    }
    return errors;
  };

  const sendData = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const newFeedback = {
        fullName,
        email,
        phone,
        checkInDate,
        hearAboutUs,
        purposeOfVisit,
        serviceRating,
        comments,
      };

      try {
        await axios.post('http://localhost:8070/feedback/submit', newFeedback);
        setSuccessMessage('Feedback submitted successfully!');
        setErrorMessage('');
        setFullName('');
        setEmail('');
        setPhone('');
        setCheckInDate('');
        setHearAboutUs('');
        setPurposeOfVisit('');
        setServiceRating('');
        setComments('');
      } catch (error) {
        setErrorMessage('There was an error submitting your feedback');
        setSuccessMessage('');
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={sendData}>
        <h2><center>Customer Feedback</center></h2><br />
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">FULL NAME *</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            id="fullName"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">EMAIL *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">PHONE NUMBER *</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            id="phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
        {/* Check-In Date */}
        <div className="form-group">
          <label htmlFor="checkInDate">CHECK-IN DATE</label>
          <input
            type="date"
            className="form-control"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>
        {/* How Did You Hear About Us */}
        <div className="form-group">
          <label>HOW DID YOU HEAR ABOUT US?</label>
          <select
            className="form-control"
            value={hearAboutUs}
            onChange={(e) => setHearAboutUs(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="Friends">Friends</option>
            <option value="Social Media">Social Media</option>
            <option value="Ads">Ads</option>
          </select>
        </div>
        {/* Purpose of Visit */}
        <div className="form-group">
          <label>WHAT WAS THE PURPOSE OF YOUR VISIT?</label>
          <select
            className="form-control"
            value={purposeOfVisit}
            onChange={(e) => setPurposeOfVisit(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="Products Buy">Products Buy</option>
            <option value="Visit To Web">Visit To Web</option>
          </select>
        </div>
        {/* Service Rating */}
        <div className="form-group">
          <label>HOW WOULD YOU RATE OUR SERVICE?</label>
          <select
            className="form-control"
            value={serviceRating}
            onChange={(e) => setServiceRating(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
          </select>
        </div>
        {/* Comments */}
        <div className="form-group">
          <label>COMMENTS</label>
          <textarea
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Submit</button>
        {/* Success/Error Messages */}
        {successMessage && <p className="text-success">{successMessage}</p>}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </form>
    </div>
  );
}
