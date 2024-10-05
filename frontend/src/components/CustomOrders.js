// src/components/CustomOrders.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CustomOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const customerId = Cookies.get('customerId');  // Get the customer ID from the cookie
            try {
                const response = await axios.get(`http://localhost:8070/requests/customer/${customerId}`);
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>My Custom Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            <h3>{order.partName}</h3>
                            <p>Machine: {order.machineModel} ({order.machineType})</p>
                            <p>Quantity: {order.quantity}</p>
                            <p>Status: {order.status || 'Pending'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomOrders;
