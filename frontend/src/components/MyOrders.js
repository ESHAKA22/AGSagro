import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/MyOrders.css';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrderId, setEditingOrderId] = useState(null);  // Track which order is being edited
    const [editedOrder, setEditedOrder] = useState({});  // Store the updated data during edit
    const navigate = useNavigate();

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8070/requests/customer', { withCredentials: true });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setError('Error fetching requests');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Initialize editing state when edit is triggered
    const handleEdit = (orderId, order) => {
        setEditingOrderId(orderId);  // Enable editing for this order
        setEditedOrder(order);  // Set the current values to edit
    };

    // Handle input changes for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder({
            ...editedOrder,
            [name]: value,
        });
    };

    // Save the edited order
    const handleSave = async (orderId) => {
        try {
            await axios.put(`http://localhost:8070/requests/${orderId}`, editedOrder, { withCredentials: true });
            setOrders(orders.map(order => (order._id === orderId ? { ...order, ...editedOrder } : order)));
            setEditingOrderId(null);  // Exit edit mode
            alert('Request updated successfully');
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Failed to update the request');
        }
    };

    // Handle order deletion
    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8070/requests/${orderId}`, { withCredentials: true });
            setOrders(orders.filter(order => order._id !== orderId));
            alert('Request deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Failed to delete the request');
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="orders-container">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="orderHeader">
                            <h3>{order.partName}</h3>
                            <span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                        <div className="orderDetails">
                            {editingOrderId === order._id ? (
                                // Editable fields
                                <>
                                    <label>
                                        <strong>Part Name:</strong>
                                        <input
                                            type="text"
                                            name="partName"
                                            value={editedOrder.partName}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Machine Type:</strong>
                                        <input
                                            type="text"
                                            name="machineType"
                                            value={editedOrder.machineType}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Machine Model:</strong>
                                        <input
                                            type="text"
                                            name="machineModel"
                                            value={editedOrder.machineModel}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Material:</strong>
                                        <input
                                            type="text"
                                            name="material"
                                            value={editedOrder.material}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Manufacture Year:</strong>
                                        <input
                                            type="text"
                                            name="ManufactureYear"
                                            value={editedOrder.ManufactureYear}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Quantity:</strong>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={editedOrder.quantity}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Surface Finish:</strong>
                                        <input
                                            type="text"
                                            name="surfaceFinish"
                                            value={editedOrder.surfaceFinish}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Message:</strong>
                                        <textarea
                                            name="yourMessage"
                                            value={editedOrder.yourMessage}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </>
                            ) : (
                                // Display fields
                                <>
                                    <p><strong>Machine Type:</strong> {order.machineType}</p>
                                    <p><strong>Machine Model:</strong> {order.machineModel}</p>
                                    <p><strong>Material:</strong> {order.material}</p>
                                    <p><strong>Manufacture Year:</strong> {order.ManufactureYear}</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    <p><strong>Surface Finish:</strong> {order.surfaceFinish}</p>
                                    <p><strong>Part Number:</strong> {order.partNumber || 'N/A'}</p>
                                    <p><strong>Message:</strong> {order.yourMessage || 'N/A'}</p>
                                </>
                            )}
                        </div>
                        <div className="orderActions">
                            {editingOrderId === order._id ? (
                                <>
                                    <button className="save-btn" onClick={() => handleSave(order._id)}>Save</button>
                                    <button className="cancel-btn" onClick={() => setEditingOrderId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(order._id, order)}
                                        disabled={order.status && order.status.toLowerCase() === 'pending'}
                                    >
                                        Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(order._id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;
