import React from 'react';
import './RejectionReasonModal.css';

const RejectionReasonModal = ({ isOpen, reason, onClose }) => {
  if (!isOpen) {
    return null; // Don't render the modal if it's not open
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Rejection Reason</h2>
        <p>{reason || 'No reason was provided by the supplier.'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RejectionReasonModal;
