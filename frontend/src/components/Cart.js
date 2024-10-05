import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:8070/api/cart', { withCredentials: true });
                setCart(response.data.products);
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

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:8070/api/cart/remove/${productId}`, { withCredentials: true });
            setCart(cart.filter(item => item.productId !== productId));
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    return (
        <div className="cart">
            <h1>My Cart</h1>
            {cart.length > 0 ? (
                <ul>
                    {cart.map((item) => (
                        <li key={item.productId}>
                            <h3>{item.productId.P_name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.productId.Price}</p>
                            <button onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
