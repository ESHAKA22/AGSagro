import React, { useState, useRef } from 'react';
import './styles/RequestList.css';
import { useNavigate } from 'react-router-dom';
import CostCalculator from './CostCalculator';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

const RequestList = ({ requests, onDelete }) => {
    console.log('RequestList received requests:', requests); // Log the requests to check

    const navigate = useNavigate();
    const [showCalculator, setShowCalculator] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [calculatedCost, setCalculatedCost] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const calculatorRef = useRef(null);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleCalculateClick = (quantity) => {
        setSelectedQuantity(quantity);
        setShowCalculator(true);

        if (calculatorRef.current) {
            calculatorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCostCalculated = (totalCost) => {
        setCalculatedCost(totalCost);
    };

    const handleGeneratePdf = (request) => {
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
        doc.text(`Calculated Cost: ${calculatedCost}`, 14, 140);

        doc.save(`request_${request._id}.pdf`);
    };

    const handleSendReport = async (request) => {
        // Logic for sending report can be added here
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
            <div className="request-cards">
                {filteredRequests.map(request => (
                    <div className="request-card" key={request._id}>
                        <h3>{request.partName}</h3>
                        <p><strong>Customer:</strong> {request.customerName}</p>
                        <p><strong>Company:</strong> {request.companyName}</p>
                        <p><strong>Machine Type:</strong> {request.machineType}</p>
                        <p><strong>Machine Model:</strong> {request.machineModel}</p>
                        <p><strong>Material:</strong> {request.material}</p>
                        <p><strong>Manufacture Year:</strong> {request.ManufactureYear}</p>
                        <p><strong>Surface Finish:</strong> {request.surfaceFinish}</p>
                        <p><strong>Quantity:</strong> {request.quantity}</p>
                        <p><strong>Your Message:</strong> {request.yourMessage}</p>
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
                            <button onClick={() => handleEdit(request._id)}>Edit</button>
                            <button onClick={() => onDelete(request._id)}>Delete</button>
                            <button onClick={() => handleCalculateClick(request.quantity)}>Calculate Cost</button>
                            <button onClick={() => handleGeneratePdf(request)}>Download PDF</button>
                            <button onClick={() => handleSendReport(request)}>Send Report</button>
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
