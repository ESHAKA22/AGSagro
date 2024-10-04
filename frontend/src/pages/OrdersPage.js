import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from '../components/RequestList';

const OrdersPage = () => {
    const [showCustomOrders, setShowCustomOrders] = useState(false);
    const [requests, setRequests] = useState([]);

    // Function to fetch requests from the backend
    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8070/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    // Handle showing custom orders
    const handleShowCustomOrders = () => {
        setShowCustomOrders(true);
        fetchRequests(); // Fetch requests when showing custom orders
    };

    // Handle showing regular orders
    const handleShowRegularOrders = () => {
        setShowCustomOrders(false);
        // Logic for showing regular orders can be implemented here
    };

    // Handle deletion of a request
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/requests/${id}`);
            fetchRequests(); // Refresh the request list after deletion
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    // Handle editing of a request
    const handleEdit = (request) => {
        // Implement edit logic as needed
        console.log('Edit request:', request);
    };

    useEffect(() => {
        // You can optionally fetch requests on component mount if needed
    }, []);

    return (
        <div>
            <h1>Orders Page</h1>
            <div style={{ marginBottom: '20px' }}>
                {/* Increased marginRight to 20px for more space between buttons */}
                <button 
                    onClick={handleShowCustomOrders} 
                    style={{
                        padding: '10px 20px',
                        marginRight: '20px', /* Increased space between buttons */
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Custom Orders
                </button>
                <button 
                    onClick={handleShowRegularOrders} 
                    style={{
                        padding: '10px 20px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Regular Orders
                </button>
            </div>

            {showCustomOrders && (
                <div>
                    <h2>Custom Orders List</h2>
                    <RequestList requests={requests} onDelete={handleDelete} onEdit={handleEdit} />
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
