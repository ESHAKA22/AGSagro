import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '.styles/Report.css'; // Assuming you have a CSS file for styling

const Report = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tickets report from the backend
    axios.get("http://localhost:8070/customer/reports")
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="header">Tickets Report</h2>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Problem</th>
              <th>Priority</th>
              <th>Comments</th>
              <th>Attachment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.first_name}</td>
                <td>{ticket.last_name}</td>
                <td>{ticket.email}</td>
                <td>{ticket.phone_number}</td>
                <td>{ticket.problem_type}</td>
                <td>{ticket.priority_level}</td>
                <td>{ticket.comments}</td>
                <td>
                  {ticket.attachment ? (
                    <a 
                      href={`http://localhost:8070/uploads/${ticket.attachment}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "None"
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/ticket/edit/${ticket.id}`)} 
                    className="btn btn-warning"
                    aria-label={`Edit ticket ${ticket.id}`}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Report;
