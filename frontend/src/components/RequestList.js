import React, { useState, useRef, useEffect } from 'react';
import './styles/RequestList.css';
import { useNavigate } from 'react-router-dom';
import CostCalculator from './CostCalculator';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import moment from 'moment';

const RequestList = ({ requests, fetchRequests }) => {
    const navigate = useNavigate();
    const [showCalculator, setShowCalculator] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [calculatedCost, setCalculatedCost] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // To disable buttons during processing
    const [notification, setNotification] = useState(null); // State to manage notifications
    const calculatorRef = useRef(null);
    const notificationRef = useRef(null); // Create a ref for the notification

    const handleApiCall = async (apiFunc, successMessage) => {
        try {
            setIsProcessing(true); // Disable buttons while processing
            setNotification(null); // Clear any previous notifications
            await apiFunc(); // Call the API function
            setNotification({ type: 'success', message: successMessage });
            fetchRequests(); // Refresh the list after operation
            scrollToNotification(); // Scroll to the notification
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'An error occurred while processing your request. Please try again later.' });
            scrollToNotification(); // Scroll to the notification
        } finally {
            setIsProcessing(false); // Re-enable buttons
        }
    };

    const scrollToNotification = () => {
        if (notificationRef.current) {
            notificationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleApprove = (id) => {
        handleApiCall(
            () => axios.put(`http://localhost:8070/requests/${id}/approve`, { withCredentials: true }),
            'The request has been successfully approved!'
        );
    };

    const handleReject = (id) => {
        handleApiCall(
            () => axios.put(`http://localhost:8070/requests/${id}/reject`, { withCredentials: true }),
            'The request has been successfully rejected.'
        );
    };

    const handleDelete = (id) => {
        handleApiCall(
            () => axios.delete(`http://localhost:8070/requests/${id}`, { withCredentials: true }),
            'The request has been successfully deleted.'
        );
    };

    const handleCalculateClick = (quantity, e) => {
        e.preventDefault(); // Prevent default behavior
        setSelectedQuantity(quantity);
        setShowCalculator(true);

        if (calculatorRef.current) {
            calculatorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCostCalculated = (totalCost) => {
        setCalculatedCost(totalCost);
    };

    const handleGeneratePdf = (request, e) => {
        e.preventDefault(); // Prevent default behavior
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Request Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Customer Name: ${request.customerName}`, 14, 40);
        doc.text(`Company Name: ${request.companyName}`, 14, 50);
        doc.text(`Part Name: ${request.partName}`, 14, 60);
        doc.text(`Machine Type: ${request.machineType}`, 14, 70);
        doc.text(`Machine Model: ${request.machineModel}`, 14, 80);
        doc.text(`Material: ${request.material}`, 14, 90);
        doc.text(`Manufacture Year: ${request.ManufactureYear}`, 14, 100);
        doc.text(`Surface Finish: ${request.surfaceFinish}`, 14, 110);
        doc.text(`Quantity: ${request.quantity}`, 14, 120);
        doc.text(`Your Message: ${request.yourMessage}`, 14, 130);
        doc.text(`Created At: ${moment(request.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, 14, 140);
        doc.text(`Calculated Cost: ${calculatedCost}`, 14, 150);
        doc.save(`request_${request._id}.pdf`);
    };

    const filteredRequests = requests.filter(request =>
        request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="request-list-container">
            <h2>Request List</h2>
            <input
                type="text"
                placeholder="Search by part name or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            {notification && (
                <div ref={notificationRef} className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <div className="request-cards">
                {filteredRequests.map(request => (
                    <div className="request-card" key={request._id}>
                        <h3>{request.partName}</h3>
                        <p><strong>Customer ID:</strong> {request.customerId}</p>
                        <p><strong>Customer Name:</strong> {request.customerName}</p>
                        <p><strong>Company Name:</strong> {request.companyName}</p>
                        <p><strong>Machine Type:</strong> {request.machineType}</p>
                        <p><strong>Machine Model:</strong> {request.machineModel}</p>
                        <p><strong>Material:</strong> {request.material}</p>
                        <p><strong>Manufacture Year:</strong> {request.ManufactureYear}</p>
                        <p><strong>Surface Finish:</strong> {request.surfaceFinish}</p>
                        <p><strong>Quantity:</strong> {request.quantity}</p>
                        <p><strong>Message:</strong> {request.yourMessage}</p>
                        <p><strong>Created At:</strong> {moment(request.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                        <p>
                            <strong>Design File:</strong> 
                            {request.designFile ? (
                                <a
                                    href={`http://localhost:8070/${request.designFile.split('/').pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    {request.designFile.split('/').pop()}
                                </a>
                            ) : (
                                'No file uploaded'
                            )}
                        </p>
                        <div className="request-actions">
                            <button onClick={(e) => handleApprove(request._id, e)} disabled={isProcessing}>Approve</button>
                            <button onClick={(e) => handleReject(request._id, e)} disabled={isProcessing}>Reject</button>
                            <button onClick={(e) => handleCalculateClick(request.quantity, e)} disabled={isProcessing}>Calculate Cost</button>
                            <button onClick={(e) => handleGeneratePdf(request, e)} disabled={isProcessing}>Download PDF</button>
                            <button onClick={(e) => handleDelete(request._id, e)} disabled={isProcessing}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {showCalculator && (
                <div ref={calculatorRef}>
                    <CostCalculator quantity={selectedQuantity} onCostCalculated={handleCostCalculated} />
                </div>
            )}
        </div>
    );
};

export default RequestList;
