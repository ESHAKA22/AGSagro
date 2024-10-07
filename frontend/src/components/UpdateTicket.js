import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
//import './UpdateTicket.css';

export default function UpdateTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    priority_level: "",
    problem: "",
    comments: "",
    attachment: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the ticket details by ID
    axios
      .get(`http://localhost:8070/customer/tickets/${id}`)
      .then((res) => {
        setTicket(res.data);
        setFormData(res.data); // Populate form fields with existing ticket data
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachment: e.target.files[0] // Store the selected file
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });

    // Update the ticket
    axios
      .put(`http://localhost:8070/customer/update/${id}`, formDataToSubmit)
      .then(() => {
        alert("Ticket updated successfully");
        navigate("/manage-tickets"); // Navigate back to the tickets management page
      })
      .catch((error) => {
        console.error("Error updating ticket:", error);
      });
  };

  if (!ticket) return <p>Loading...</p>; // Loading state while fetching ticket

  return (
    <div className="container">
      <h2>Update Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Priority Level:</label>
          <input
            type="text"
            name="priority_level"
            value={formData.priority_level}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Problem:</label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Comments:</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Attachment:</label>
          <input
            type="file"
            name="attachment"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Ticket</button>
      </form>
    </div>
  );
}
