import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // For getting customerId from cookies
import { useNavigate } from 'react-router-dom'; // To navigate to the return page

const MyPayments = () => {
    const [orders, setOrders] = useState([]);
    const customerId = Cookies.get('customerId'); // Fetch the customerId from cookies
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
        <div className="my-payments-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={index} className="payment-summary">
                            <h1>Order ID: {order.orderId}</h1>
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

            <style jsx>{`
                .my-payments-container {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                    border-radius: 8px;
                }

                .my-payments-container h2 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                     border-bottom: 1px solid #eee;
                }

                .payment-summary {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    margin: 20px 0;
                    padding: 20px;
                }

                .payment-summary h2 {
                    color: #555;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }

                .payment-summary p {
                    color: #666;
                }

                .payment-summary strong {
                    color: #333;
                }

                .payment-summary ul {
                    list-style: none;
                    padding: 0;
                }

                .payment-summary li {
                    background: #f9f9f9;
                    margin: 5px 0;
                    padding: 10px;
                    border-radius: 4px;
                }

                .payment-summary button {
                    background-color: #047129;  /* Primary color */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 15px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .payment-summary button:hover {
                    background-color: #0056b3;  /* Darker shade on hover */
                }

                .payment-summary hr {
                    margin: 20px 0;
                    border: 0;
                    border-top: 1px solid #eee;
                }
            `}</style>
        </div>
    );
};

export default MyPayments;
