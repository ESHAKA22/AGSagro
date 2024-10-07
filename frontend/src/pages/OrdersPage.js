import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from '../components/RequestList';

const OrdersPage = () => {
    const [showCustomOrders, setShowCustomOrders] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch requests from the backend
    const fetchRequests = async () => {
        setLoading(true);  // Show loading spinner
        setError(null);    // Reset error state
        try {
            const response = await axios.get('http://localhost:8070/api/requests');  // Correct endpoint
            console.log('Fetched Custom Orders:', response.data);  // Log data to verify
            setRequests(response.data);  // Set the fetched requests
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to fetch requests.');  // Set error message
        } finally {
            setLoading(false);  // Stop loading spinner
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
        console.log('Edit request:', request);
    };

    return (
        <div>
            <h1>Orders Page</h1>
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={handleShowCustomOrders} 
                    style={{
                        padding: '10px 20px',
                        marginRight: '20px', 
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

                    {loading && <p>Loading custom orders...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && !error && (
                        <RequestList 
                            requests={requests} 
                            fetchRequests={fetchRequests}  // Pass fetchRequests function here
                            onDelete={handleDelete} 
                            onEdit={handleEdit} 
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
