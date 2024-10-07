import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import your modal component
import './SmPOV.css';

const SupplierRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const updateRequestStatus = async (id, status) => {
    let reason = '';

    if (status === 'Rejected') {
      reason = prompt('Please provide a reason for rejection:');
      if (!reason) {
        alert('Reason is required for rejection');
        return;
      }
    }

    try {
      await axios.put(`http://localhost:8070/api/stockrequests/requests/${id}/status`, {
        status,
        reason,
      });
      fetchRequests(); // Refresh requests
    } catch (err) {
      setError('Error updating request status');
    }
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="supplier-requests-container">
      <h1>Stock Replenishment Requests</h1>
      {error && <p className="error">{error}</p>}
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
              <td>{request.quantity}</td>
              <td>{new Date(request.requestDate).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' && (
                  <>
                    <button onClick={() => updateRequestStatus(request._id, 'Approved')}>Approve</button>
                    <button onClick={() => updateRequestStatus(request._id, 'Rejected')}>Reject</button>
                  </>
                )}
                <button onClick={() => viewRequestDetails(request)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing request details */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default SupplierRequests;
