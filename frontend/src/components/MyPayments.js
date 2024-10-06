import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // For getting customerId from cookies
import { useNavigate } from 'react-router-dom';  // To navigate to the return page

const MyPayments = () => {
    const [orders, setOrders] = useState([]);
    const customerId = Cookies.get('customerId');  // Fetch the customerId from cookies
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve saved orders for the specific customerId from localStorage
        const savedOrders = JSON.parse(localStorage.getItem(`orders_${customerId}`)) || [];
        
        // Set orders to the filtered list for this specific customer
        setOrders(savedOrders);
    }, [customerId]);

    const handleReturnRequest = (orderId) => {
        // Navigate to the return request page with the orderId
        navigate(`/return-request/${orderId}`, { state: { orderId } });
    };

    return (
        <div>
            <h1>My Payments</h1>
            {orders.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={index} className="payment-summary">
                            <h2>Order ID: {order.orderId}</h2>
                            <p><strong>Payment Date:</strong> {order.paymentDate}</p>
                            <p><strong>Total Amount Paid:</strong> Rs. {order.cartTotal.toLocaleString()}</p>

                            <h3>Items:</h3>
                            <ul>
                                {order.cart.map((item, idx) => (
                                    <li key={idx}>
                                        {item.productId.P_name} - {item.quantity} x Rs. {item.productId.Price.toLocaleString()}
                                    </li>
                                ))}
                            </ul>

                            {/* Return Button */}
                            <button onClick={() => handleReturnRequest(order.orderId)}>
                                Request Return
                            </button>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPayments;
