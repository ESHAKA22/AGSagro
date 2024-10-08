import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/styles/Checkout.css'; // Import a separate CSS file for checkout styles

const Checkout = () => {
    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        zipCode: '',
    });
    
    // State to handle validation errors
    const [errors, setErrors] = useState({ phone: '' });

    const { state } = useLocation();
    const { cart } = state || { cart: [] };
    const customerId = Cookies.get('customerId');
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId) {
            axios.get(`http://localhost:8070/api/clients/${customerId}`)
                .then(response => {
                    const { firstName, lastName, address, city, phone, email, zipCode } = response.data;
                    setShippingDetails({ firstName, lastName, address, city, phone, email, zipCode });
                })
                .catch(error => {
                    console.error('Error fetching customer details:', error);
                });
        }
    }, [customerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));

        // Validate phone number
        if (name === 'phone') {
            const phoneRegex = /^[0-9]{10}$/; // Adjust this regex according to your desired format
            if (!phoneRegex.test(value)) {
                setErrors(prev => ({ ...prev, phone: 'Phone number must be 10 digits.' }));
            } else {
                setErrors(prev => ({ ...prev, phone: '' })); // Clear error if valid
            }
        }
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        
        // Check for errors before proceeding
        if (errors.phone) {
            alert('Please fix the errors before proceeding.');
            return;
        }

        navigate('/payment', { 
            state: { 
                cart, 
                shippingDetails 
            } 
        });
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Shipping Information</h2>
            <form className="checkout-form" onSubmit={handleProceedToPayment}>
                {Object.entries(shippingDetails).map(([key, value]) => (
                    <div className="form-group" key={key}>
                        <label htmlFor={key} className="form-label">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        <input
                            id={key}
                            type={key === 'email' ? 'email' : 'text'}
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                        {/* Show error message for phone input */}
                        {key === 'phone' && errors.phone && (
                            <span className="error-message">{errors.phone}</span>
                        )}
                    </div>
                ))}
                <button type="submit" className="checkout-button">Proceed to Payment</button>
            </form>
            <h2 className="cart-summary-title">Cart Summary</h2>
            <ul className="cart-summary-list">
                {cart.map(item => (
                    <li key={item.productId._id} className="cart-item">
                        <strong>{item.productId.P_name}</strong> - Rs. {item.productId.Price.toLocaleString()} x {item.quantity}
                        <strong> Total:</strong> Rs. {(item.productId.Price * item.quantity).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Checkout;
