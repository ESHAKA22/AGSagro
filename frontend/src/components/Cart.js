import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [quantities, setQuantities] = useState({}); // Store quantities for each product
    const [isQuantityChanged, setIsQuantityChanged] = useState({}); // Track if quantity is changed for each product

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:8070/api/cart', { withCredentials: true });
                setCart(response.data.products);

                // Initialize quantities and isQuantityChanged states based on the fetched cart
                const initialQuantities = {};
                const initialChanges = {};
                response.data.products.forEach(item => {
                    initialQuantities[item.productId._id] = item.quantity; // Use _id to ensure unique identification
                    initialChanges[item.productId._id] = false; // Initially, no quantity is changed
                });
                setQuantities(initialQuantities);
                setIsQuantityChanged(initialChanges);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        const getCustomerIdFromCookies = () => {
            const id = document.cookie
                .split('; ')
                .find(row => row.startsWith('customerId='))
                ?.split('=')[1];
            setCustomerId(id);
        };

        fetchCart();
        getCustomerIdFromCookies();
    }, []);

    const handleCheckout = () => {
      navigate('/checkout'); // Redirect to the order page
  };

    const handleIncreaseQuantity = (productId) => {
        const newQuantity = quantities[productId] + 1;
        setQuantities({
            ...quantities,
            [productId]: newQuantity // Only update the specific product's quantity
        });
        setIsQuantityChanged({
            ...isQuantityChanged,
            [productId]: true // Mark that the quantity has changed for this product
        });
    };

    const handleDecreaseQuantity = (productId) => {
        const newQuantity = quantities[productId] > 1 ? quantities[productId] - 1 : 1;
        setQuantities({
            ...quantities,
            [productId]: newQuantity // Only update the specific product's quantity
        });
        setIsQuantityChanged({
            ...isQuantityChanged,
            [productId]: true // Mark that the quantity has changed for this product
        });
    };

    const handleUpdateQuantity = async (productId) => {
        try {
            await axios.put('http://localhost:8070/api/cart/update', {
                productId,
                quantity: quantities[productId]
            }, { withCredentials: true });

            // After update, mark quantity change as false for the product
            setIsQuantityChanged({
                ...isQuantityChanged,
                [productId]: false
            });

            alert('Cart updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:8070/api/cart/remove/${productId}`, { withCredentials: true });
            setCart(cart.filter(item => item.productId._id !== productId));
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    return (
        <div className="cart">
            <h1>My Cart</h1>
            {cart.length > 0 ? (
                <ul>
                    {cart.map((item) => {
                        const unitPrice = item.productId.Price; // The price of a single unit
                        const totalPrice = unitPrice * quantities[item.productId._id]; // Total price for the product
                        return (
                            <li key={item.productId._id}>
                                <h3>{item.productId.P_name}</h3>

                                {/* Display Unit Price and Total Price */}
                                <p>Unit Price: Rs. {unitPrice.toLocaleString('en-LK')}</p>
                                <p>Total Price: Rs. {totalPrice.toLocaleString('en-LK')}</p>

                                {/* Quantity Controls */}
                                <div className="quantity-container">
                                    <button onClick={() => handleDecreaseQuantity(item.productId._id)}>-</button>
                                    <span>{quantities[item.productId._id]}</span>
                                    <button onClick={() => handleIncreaseQuantity(item.productId._id)}>+</button>
                                </div>

                                {/* Show Update button only if quantity is changed */}
                                {isQuantityChanged[item.productId._id] && (
                                    <button 
                                        className="update-button" 
                                        onClick={() => handleUpdateQuantity(item.productId._id)}
                                    >
                                        Update
                                    </button>
                                )}

                                {/* Remove Button */}
                                <button onClick={() => handleRemoveFromCart(item.productId._id)}>Remove</button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
