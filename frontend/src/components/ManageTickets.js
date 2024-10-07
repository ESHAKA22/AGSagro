import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ManageTickets.css';

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all tickets
    axios
      .get("http://localhost:8070/customer/tickets") // Adjust API endpoint as needed
      .then((res) => {
        setTickets(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  // Delete a ticket
  const deleteTicket = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      axios
        .delete(`http://localhost:8070/customer/delete/${id}`)
        .then(() => {
          setTickets(tickets.filter(ticket => ticket._id !== id));
          alert("Ticket deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting ticket:", error);
        });
    }
  };

  return (
    <div className="container">
      <h2>Manage Tickets</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Problem</th>
            <th>Priority Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.first_name}</td>
              <td>{ticket.last_name}</td>
              <td>{ticket.email}</td>
              <td>{ticket.phone_number}</td>
              <td>{ticket.problem}</td>
              <td>{ticket.priority_level}</td>
              <td>
                <button
                  onClick={() => navigate(`/update-ticket/${ticket._id}`)} // Update this line
                  className="btn btn-primary"
                >
                  Update Ticket
                </button>
                <button
                  onClick={() => deleteTicket(ticket._id)}
                  className="btn btn-danger ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
