import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF library
import "jspdf-autotable"; // Import jsPDF AutoTable plugin
import './AddTicket.css';

export default function AddTicket() {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [option, setOption] = useState("");
  const [radios, setRadios] = useState("");
  const [comment, setComment] = useState("");
  const [attach, setAttach] = useState(null);
  const [rangeValue, setRangeValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(""); // New state for date input

  const formFields = [fname, lname, email, number, option, radios, comment, date];
  const totalFields = formFields.length;
  const filledFields = formFields.filter((field) => field !== "").length;
  const progress = (filledFields / totalFields) * 100;

  useEffect(() => {
    setRangeValue(progress);
  }, [progress]);

  const validate = () => {
    let errors = {};

    if (!fname.trim()) errors.fname = "First name is required";
    if (!lname.trim()) errors.lname = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email address is invalid";
    if (!number.trim()) {
      errors.number = "Phone number is required";
    } else if (!/^\d{10}$/.test(number)) {
      errors.number = "Phone number must be exactly 10 digits.";
    }
    if (!date.trim()) errors.date = "Date is required"; // Validate date

    return errors;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set up PDF Title and Headers
    doc.setFontSize(18);
    doc.text("Ticket Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Create Table Structure
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["First Name", fname],
      ["Last Name", lname],
      ["Email", email],
      ["Phone Number", number],
      ["Problem Type", option],
      ["Priority Level", radios],
      ["Comments", comment],
      ["Date", date], // Add date to the PDF
    ];

    // Adding table using AutoTable plugin
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start the table below the title
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    doc.save("ticket_report.pdf");
  };

  function sendData(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", fname);
    formData.append("last_name", lname);
    formData.append("email", email);
    formData.append("phone_number", number);
    formData.append("priority_level", radios);
    formData.append("problem", option);
    formData.append("comments", comment);
    formData.append("date", date); // Add date to form data
    if (attach) {
      formData.append("attachment", attach);
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:8070/customer/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("Ticket added successfully");
          generatePDF(); // Generate the PDF for the new ticket

          // Clear form fields
          setFName("");
          setLName("");
          setEmail("");
          setNumber("");
          setOption("");
          setRadios("");
          setComment("");
          setAttach(null);
          setDate(""); // Clear date field

          // Set form as submitted
          setSubmitted(true);

          // Wait for 2 seconds, then refresh the page
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => console.error("Error submitting form:", error));
    } else {
      setErrors(validationErrors);
    }
  }

  return (
    <div className="ticket-form-container">
      <form onSubmit={sendData}>
        <h2>Submit a Ticket</h2>
        <div className="form-group">
          <label htmlFor="fname">First Name *</label>
          <input
            type="text"
            className={`form-control ${errors.fname ? "is-invalid" : ""}`}
            id="fname"
            placeholder="Enter first name"
            onChange={(e) => setFName(e.target.value)}
            value={fname}
          />
          {errors.fname && <div className="invalid-feedback">{errors.fname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lname">Last Name *</label>
          <input
            type="text"
            className={`form-control ${errors.lname ? "is-invalid" : ""}`}
            id="lname"
            placeholder="Enter last name"
            onChange={(e) => setLName(e.target.value)}
            value={lname}
          />
          {errors.lname && <div className="invalid-feedback">{errors.lname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="number">Phone Number *</label>
          <input
            type="text"
            className={`form-control ${errors.number ? "is-invalid" : ""}`}
            id="number"
            placeholder="Enter phone number"
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10 characters
              if (/^\d{0,10}$/.test(value)) {
                setNumber(value);
              }
            }}
            value={number}
          />
          {errors.number && <div className="invalid-feedback">{errors.number}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="option">I’m having a problem with *</label>
          <select
            className="form-control"
            id="option"
            required
            onChange={(e) => setOption(e.target.value)}
            value={option}
          >
            <option value="" disabled>
              Choose...
            </option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <fieldset className="form-group">
          <legend className="col-form-label">Priority Level *</legend>
          <div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios1"
                value="Today"
                onChange={(e) => setRadios(e.target.value)}
                checked={radios === "Today"}
              />
              <label className="form-check-label" htmlFor="gridRadios1">
                Today
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="In The Next 48 Hours"
                onChange={(e) => setRadios(e.target.value)}
                checked={radios === "In The Next 48 Hours"}
              />
              <label className="form-check-label" htmlFor="gridRadios2">
                In The Next 48 Hours
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios3"
                value="This Week"
                onChange={(e) => setRadios(e.target.value)}
                checked={radios === "This Week"}
              />
              <label className="form-check-label" htmlFor="gridRadios3">
                This Week
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios4"
                value="Future"
                onChange={(e) => setRadios(e.target.value)}
                checked={radios === "Future"}
              />
              <label className="form-check-label" htmlFor="gridRadios4">
                Future
              </label>
            </div>
          </div>
        </fieldset>

        <div className="form-group">
          <label htmlFor="comment">Comments</label>
          <textarea
            className="form-control"
            id="comment"
            rows="3"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="attach">Attachment</label>
          <input
            type="file"
            className="form-control"
            id="attach"
            onChange={(e) => setAttach(e.target.files[0])}
          />
        </div>

        <div className="progress" style={{ height: "20px", marginTop: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${rangeValue}%` }}
            aria-valuenow={rangeValue}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(rangeValue)}%
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
