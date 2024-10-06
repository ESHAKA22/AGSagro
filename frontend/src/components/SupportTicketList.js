import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import './SupportTicketList.css';

export default function SupportTicketList() {
  const [tickets, setTickets] = useState([]);
  const [editTicketId, setEditTicketId] = useState(null);
  const [editedTicket, setEditedTicket] = useState({});
  const [replyTicketId, setReplyTicketId] = useState(null); // Tracks the ticket being replied to
  const [reply, setReply] = useState(""); // Stores the reply text
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering tickets

  // Fetch tickets from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8070/customer/tickets")
      .then((res) => {
        setTickets(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  // Delete ticket
  const deleteTicket = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      axios
        .delete(`http://localhost:8070/customer/delete/${id}`)
        .then((res) => {
          alert("Ticket deleted successfully");
          setTickets(tickets.filter((ticket) => ticket._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting ticket:", error);
        });
    }
  };

  // Start editing a ticket
  const startEditing = (ticket) => {
    setEditTicketId(ticket._id);
    setEditedTicket(ticket);
  };

  // Handle changes to the ticket form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update the ticket
  const updateTicket = (id) => {
    axios
      .put(`http://localhost:8070/customer/update/${id}`, editedTicket)
      .then((res) => {
        alert("Ticket updated successfully");
        setTickets(tickets.map((ticket) => (ticket._id === id ? res.data : ticket)));
        setEditTicketId(null);
      })
      .catch((error) => {
        console.error("Error updating ticket:", error);
      });
  };

  // Handle reply submission
  const handleReply = (ticketId) => {
    if (reply.trim() !== "") {
      axios
        .post(`http://localhost:8070/customer/reply/${ticketId}`, { reply })
        .then((res) => {
          const updatedTicket = res.data;
          alert(res.data.message);
          console.log("PDF generated at:", updatedTicket.pdfPath);
          // Update ticket with new reply
          setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket._id === ticketId ? { ...ticket, reply: updatedTicket.reply } : ticket
            )
          );

          // Clear reply and close reply form
          setReply("");
          setReplyTicketId(null);
        })
        .catch((error) => {
          console.error("Error sending reply:", error);
          alert("Error sending reply");
        });
    } else {
      alert("Reply cannot be empty.");
    }
  };

  // Generate PDF report of a single ticket
  const generateSingleTicketReport = (ticket) => {
    const doc = new jsPDF();

    // Report Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 128); // Set color for title
    doc.text("Support Ticket Report", 14, 22);

    // Add date and a line break
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset color to black for the rest of the content
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);
    doc.line(10, 35, 200, 35); // Horizontal line for separation

    // Ticket Info
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102); // Set color for ticket heading
    doc.text(`Ticket Details`, 14, 45);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset text color for details

    // Add ticket information
    doc.text(`First Name: ${ticket.first_name || "N/A"}`, 14, 55);
    doc.text(`Last Name: ${ticket.last_name || "N/A"}`, 14, 65);
    doc.text(`Email: ${ticket.email || "N/A"}`, 14, 75);
    doc.text(`Phone Number: ${ticket.phone_number || "N/A"}`, 14, 85);
    doc.text(`Problem: ${ticket.problem || "N/A"}`, 14, 95);
    doc.text(`Priority Level: ${ticket.priority_level || "N/A"}`, 14, 105);
    doc.text(`Comments: ${ticket.comments || "No comments"}`, 14, 115);
    doc.text(`Reply: ${ticket.reply || "No reply yet"}`, 14, 125);

    // Save the PDF
    doc.save(`${ticket.first_name}_${ticket.last_name}_ticket_report.pdf`);
  };

  // Generate PDF report for all tickets
  const generateAllTicketsReport = () => {
    const doc = new jsPDF();

    // Report Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 128); // Set color for title
    doc.text("Support Tickets Report", 14, 22);
    
    // Add date and a line break
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset color to black for the rest of the content
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);
    doc.line(10, 35, 200, 35); // Horizontal line for separation

    // Set Y position for data
    let yPosition = 45;

    // Iterate over tickets and add them to the PDF as a list
    tickets.forEach((ticket, index) => {
      if (yPosition > 270) { // Check if page height is exceeded
        doc.addPage();
        yPosition = 20;
      }

      // Add background for each ticket block (optional for visual grouping)
      doc.setFillColor(240, 240, 240); // Light grey background
      doc.rect(10, yPosition - 4, 190, 60, 'F'); // Create a filled rectangle as background

      // Ticket Info
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102); // Set color for ticket heading
      doc.text(`Ticket ${index + 1}`, 14, yPosition);
      yPosition += 10;

      // Details with bold labels for clarity
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Reset text color for details
      doc.text(`First Name:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.first_name || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal"); // Reset to normal font
      yPosition += 10;

      doc.text(`Last Name:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.last_name || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Email:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.email || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Phone Number:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.phone_number || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Problem:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.problem || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Priority Level:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.priority_level || "N/A", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Comments:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.comments || "No comments", 60, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      doc.text(`Reply:`, 14, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.reply || "No reply yet", 60, yPosition);
      doc.setFont("helvetica", "normal");

      yPosition += 20; // Add extra space between tickets
    });

    // Save the PDF
    doc.save("support-tickets-report.pdf");
  };

  // Filter tickets based on the search query
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cont">
      <h2>Support Tickets</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by First Name or Last Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="btn btn-success mb-3" onClick={generateAllTicketsReport}>
        Generate All Tickets Report
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Problem</th>
            <th>Priority Level</th>
            <th>Comments</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <React.Fragment key={ticket._id}>
              {editTicketId === ticket._id ? (
                <tr>
                  <td colSpan="9">
                    <input
                      type="text"
                      name="first_name"
                      value={editedTicket.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={editedTicket.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="form-control mb-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editedTicket.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      name="phone_number"
                      value={editedTicket.phone_number}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="form-control mb-2"
                    />
                    <select
                      name="problem"
                      value={editedTicket.problem}
                      onChange={handleChange}
                      className="form-control mb-2"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      name="priority_level"
                      value={editedTicket.priority_level}
                      onChange={handleChange}
                      className="form-control mb-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <textarea
                      name="comments"
                      value={editedTicket.comments}
                      onChange={handleChange}
                      placeholder="Comments"
                      rows="3"
                      className="form-control mb-2"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => updateTicket(ticket._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={() => setEditTicketId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>{ticket.first_name}</td>
                  <td>{ticket.last_name}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.phone_number}</td>
                  <td>{ticket.problem}</td>
                  <td>{ticket.priority_level}</td>
                  <td>{ticket.comments}</td>
                  <td>{ticket.reply || "No reply yet"}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => startEditing(ticket)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => deleteTicket(ticket._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-info ml-2"
                      onClick={() => setReplyTicketId(ticket._id)}
                    >
                      Reply
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={() => generateSingleTicketReport(ticket)}
                    >
                      Generate Report
                    </button>
                  </td>
                </tr>
              )}

              {replyTicketId === ticket._id && (
                <tr>
                  <td colSpan="9">
                    <textarea
                      className="form-control"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply here"
                      rows="3"
                    ></textarea>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleReply(ticket._id)}
                    >
                      Send Reply
                    </button>
                    <button
                      className="btn btn-secondary mt-2 ml-2"
                      onClick={() => setReplyTicketId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
