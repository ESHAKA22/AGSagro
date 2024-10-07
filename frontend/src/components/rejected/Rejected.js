import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Rejected() {
    const [rejectedOrders, setRejectedOrders] = useState([]);

    useEffect(() => {
        const fetchRejectedOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8100/returns?status=rejected');
                setRejectedOrders(response.data.returns);
            } catch (error) {
                console.error('Error fetching rejected orders:', error);
            }
        };

        fetchRejectedOrders();
    }, []);

    return (
        <div>
            <h1>Rejected Orders</h1>
            {rejectedOrders.length === 0 ? (
                <p>No rejected orders found.</p>
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
                        {rejectedOrders.map((order) => (
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

export default Rejected;
