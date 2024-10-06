// ConfirmationModal.js
import React from 'react';
import './ConfirmationModal.css';  // Import a CSS file for the modal styling

const ConfirmationModal = ({ show, onClose, onConfirm, totalAmount }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Payment</h2>
                <p>Total Amount: Rs. {totalAmount.toLocaleString()}</p>
                <p>Are you sure you want to proceed with the payment?</p>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>Yes, Confirm</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
