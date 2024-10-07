import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockReplenishmentRequests.css';
import CreateRequestForm from './CreateRequestForm';
import RejectionReasonModal from './RejectionReasonModal'; // Import the modal component
import Nav from "../Nav/Nav";

const StockReplenishmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/stockrequests/requests');
      setRequests(response.data);
    } catch (err) {
      setError('Error fetching requests');
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantity({ ...quantity, [id]: value });
  };

  const updateRequestQuantity = async (id) => {
    const confirmUpdate = window.confirm("Are you sure you want to update the quantity?");
    if (!confirmUpdate) return;

    try {
      await axios.put(`http://localhost:8070/api/stockrequests/requests/${id}/quantity`, {
        quantity: quantity[id],
      });
      fetchRequests(); // Refresh requests
    } catch (err) {
      setError('Error updating quantity');
    }
  };

  const deleteRequest = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8070/api/stockrequests/requests/${id}`);
      fetchRequests(); // Refresh requests
    } catch (err) {
      setError('Error deleting request');
    }
  };

  const handleRequestCreated = () => {
    fetchRequests(); // Refresh the requests list after creating a new request
  };

  const viewReason = (reason) => {
    setSelectedReason(reason || 'No reason was provided by the supplier.');
    setShowReasonModal(true); // Open the modal to show the rejection reason
  };

  return (
    <div>
      <Nav/>
      <div className="requests-container">
      <h1>Stock Replenishment Requests</h1>
      {error && <p className="error">{error}</p>}
      <button className="create-request-button" onClick={() => setShowModal(true)}>Create Request</button>
      {showModal && (
        <div className="modal">
          <CreateRequestForm onClose={() => setShowModal(false)} onRequestCreated={handleRequestCreated} />
        </div>
      )}
      <table className="requests-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Supplier ID</th>
            <th>Quantity</th>
            <th>Request Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.productId}</td>
              <td>{request.supplierId}</td>
              <td>
                <input
                  type="number"
                  value={quantity[request._id] || request.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(request._id, e.target.value)}
                  disabled={request.status !== 'Pending'} // Disable input if not pending
                />
              </td>
              <td>{new Date(request.requestDate).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Rejected' && (
                  <button className="view-button" onClick={() => viewReason(request.Reason)}>View Reason</button>
                )}
                {request.status === 'Pending' && (
                  <>
                    <button className="update-button" onClick={() => updateRequestQuantity(request._id)}>Update</button>
                    <button className="delete-button" onClick={() => deleteRequest(request._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render the RejectionReasonModal */}
      <RejectionReasonModal
        isOpen={showReasonModal}
        reason={selectedReason}
        onClose={() => setShowReasonModal(false)}
      />
    </div>
    </div>
    
  );
};

export default StockReplenishmentRequests;
