import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Approved() {
    const [approvedOrders, setApprovedOrders] = useState([]);

    useEffect(() => {
        const fetchApprovedOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8100/returns?status=approved');
                setApprovedOrders(response.data.returns);
            } catch (error) {
                console.error('Error fetching approved orders:', error);
            }
        };

        fetchApprovedOrders();
    }, []);

    return (
        <div>
            <h1>Approved Orders</h1>
            {approvedOrders.length === 0 ? (
                <p>No approved orders found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedOrders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.ordernu}</td>
                                <td>{order.name}</td>
                                <td>{order.email}</td>
                                <td>{order.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Approved;
