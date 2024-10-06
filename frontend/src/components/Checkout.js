import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Ensure you're using js-cookie to manage cookies
import { useNavigate, useLocation } from 'react-router-dom';

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

    const { state } = useLocation();  // Receive state from route
    const { cart } = state || { cart: [] };  // Destructure cart from state
    const customerId = Cookies.get('customerId');  // Only get customerId from cookies
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
    };

    const handleProceedToPayment = () => {
        // Navigate to the Payment page with the cart and shipping details
        navigate('/payment', { 
            state: { 
                cart, 
                shippingDetails 
            } 
        });
    };

    return (
        <div className="checkout-form">
            <h1>Shipping Information</h1>
            <form>
                {Object.entries(shippingDetails).map(([key, value]) => (
                    <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        <input
                            type={key === 'email' ? 'email' : 'text'}
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                        />
                    </label>
                ))}
            </form>
            <h2>Cart Summary</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.productId._id}>
                        <strong>{item.productId.P_name}</strong> - Rs. {item.productId.Price.toLocaleString()} x {item.quantity}
                        <strong> Total:</strong> Rs. {(item.productId.Price * item.quantity).toLocaleString()}
                    </li>
                ))}
            </ul>
            <button onClick={handleProceedToPayment}>Proceed to Payment</button>
        </div>
    );
};

export default Checkout;
