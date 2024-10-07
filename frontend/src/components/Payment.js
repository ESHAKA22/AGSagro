import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';  // For getting customerId from cookies
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal'; // Import the modal component

const Payment = () => {
    const [bankDetails, setBankDetails] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        branchCode: ''
    });
    const [cartTotal, setCartTotal] = useState(0);  // State to hold total cart amount
    const [showModal, setShowModal] = useState(false);  // To show/hide the modal
    const customerId = Cookies.get('customerId');  // Get customerId from cookies

    const navigate = useNavigate();
    const { state } = useLocation();  // Receive cart and shippingDetails from Checkout
    const { cart, shippingDetails } = state || {};  // Destructure cart and shippingDetails

    // Calculate the total price of the cart when the component loads
    useEffect(() => {
        if (cart && cart.length > 0) {
            const total = cart.reduce((acc, item) => acc + (item.productId.Price * item.quantity), 0);
            setCartTotal(total);  // Set the calculated total
        }
    }, [cart]);

    const generateOrderId = () => {
        // Create a unique order ID based on the timestamp and customer ID
        const timestamp = Date.now();
        return `ORD-${customerId}-${timestamp}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBankDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        // Show confirmation modal
        setShowModal(true);
    };

    const handleConfirmPayment = () => {
        // Hide modal after confirming
        setShowModal(false);

        const orderId = generateOrderId(); // Generate a unique order ID
        const paymentDate = new Date().toLocaleDateString();

        // Simulate payment processing
        setTimeout(() => {
            // Navigate to Order Confirmation with orderId, cart, shippingDetails, and paymentDate
            navigate('/order-confirmation', { 
                state: { 
                    orderId,  // Pass the generated order ID
                    cart, 
                    shippingDetails, 
                    paymentDate, 
                    cartTotal  // Pass the total cart amount to order confirmation
                } 
            });
        }, 1000);  // Simulates a 1-second delay for the payment processing
    };

    return (
        <div>
            <h1>Payment Details</h1>

            <h3>Total Cart Amount: Rs. {cartTotal.toLocaleString()}</h3> {/* Show total cart amount */}

            <form onSubmit={handleSubmitPayment}>
                <label>
                    Account Name:
                    <input type="text" name="accountName" value={bankDetails.accountName} onChange={handleInputChange} />
                </label>
                <label>
                    Account Number:
                    <input type="text" name="accountNumber" value={bankDetails.accountNumber} onChange={handleInputChange} />
                </label>
                <label>
                    Bank Name:
                    <input type="text" name="bankName" value={bankDetails.bankName} onChange={handleInputChange} />
                </label>
                <label>
                    Branch Code:
                    <input type="text" name="branchCode" value={bankDetails.branchCode} onChange={handleInputChange} />
                </label>

                <h2>Cart Items:</h2> {/* Show cart items */}
                <ul>
                    {cart.map((item) => (
                        <li key={item.productId._id}>
                            {item.productId.P_name} - Rs. {item.productId.Price.toLocaleString()} x {item.quantity}
                        </li>
                    ))}
                </ul>

                <button type="submit">Submit Payment</button>
            </form>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showModal}
                onClose={() => setShowModal(false)}  // Close the modal
                onConfirm={handleConfirmPayment}  // Confirm the payment
                totalAmount={cartTotal}  // Pass the total amount
            />
        </div>
    );
};

export default Payment;
