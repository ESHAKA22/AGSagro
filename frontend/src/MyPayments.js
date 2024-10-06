import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // For getting customerId from cookies

const MyPayments = () => {
    const [orders, setOrders] = useState([]);
    const customerId = Cookies.get('customerId');  // Fetch the customerId from cookies

    useEffect(() => {
        // Retrieve saved orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Filter orders by customerId
        const customerOrders = savedOrders.filter(order => order.customerId === customerId);

        // Set orders to the filtered list
        setOrders(customerOrders);
    }, [customerId]);

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

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPayments;
