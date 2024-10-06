import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const OrderConfirmation = () => {
    const { state } = useLocation();
    const { orderId, cart, shippingDetails, paymentDate, cartTotal } = state || {};
    const navigate = useNavigate();
    const customerId = Cookies.get('customerId');  // Fetch the customerId from cookies

    const handleConfirm = () => {
        // Retrieve existing orders for this customer
        const savedOrders = JSON.parse(localStorage.getItem(`orders_${customerId}`)) || [];
        
        // Create a new order
        const newOrder = {
            orderId,
            cart,
            shippingDetails,
            paymentDate,
            cartTotal,
            customerId,
        };

        // Save this order for the specific customer
        savedOrders.push(newOrder);
        localStorage.setItem(`orders_${customerId}`, JSON.stringify(savedOrders));

        // Redirect to "My Payments" page
        navigate('/mypayments');
    };

    return (
        <div>
            <h1>Order Confirmation</h1>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Payment Date:</strong> {paymentDate}</p>

            <h2>Customer Details</h2>
            <p><strong>Name:</strong> {shippingDetails.firstName} {shippingDetails.lastName}</p>
            <p><strong>Email:</strong> {shippingDetails.email}</p>
            <p><strong>Phone:</strong> {shippingDetails.phone}</p>
            <p><strong>Shipping Address:</strong> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.zipCode}</p>

            <h2>Cart Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price (Rs.)</th>
                        <th>Total Price (Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    {cart && cart.length > 0 ? (
                        cart.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productId.P_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.productId.Price.toLocaleString()}</td>
                                <td>{(item.productId.Price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No items in cart</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Total Cart Amount: Rs. {cartTotal.toLocaleString()}</h3>

            <h3>Thank you for your purchase!</h3>

            {/* Confirmation Button */}
            <button onClick={handleConfirm} className="confirm-button">
                Confirm and Go to My Payments
            </button>
        </div>
    );
};

export default OrderConfirmation;
