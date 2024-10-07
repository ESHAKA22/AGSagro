import React from 'react';
import './Modal.css'; // Import the styles

const Modal = ({ isOpen, onClose, request }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Request Details</h2>
        <p><strong>Product ID:</strong> {request.productId}</p>
        <p><strong>Supplier ID:</strong> {request.supplierId}</p>
        <p><strong>Quantity:</strong> {request.quantity}</p>
        <p><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Reason:</strong> {request.status === 'Rejected' ? request.Reason : 'N/A'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
