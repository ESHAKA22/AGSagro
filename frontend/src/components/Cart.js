import React, { useState } from 'react';
import './styles/cart.css';

const Cart = ({ cartItems, updateCartItemQuantity, removeFromCart }) => {
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.Price * item.quantity, 0);
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <div>No items added to the cart.</div>
            ) : (
                <div className="cartItems">
                    {cartItems.map((item) => (
                        <div key={item._id} className="cartItem">
                            <div>{item.P_name}</div>
                            <div>Price: Rs. {item.Price}</div>
                            <div>
                                Quantity: 
                                <button onClick={() => updateCartItemQuantity(item._id, -1)} disabled={item.quantity === 1}>-</button>
                                {item.quantity}
                                <button onClick={() => updateCartItemQuantity(item._id, 1)}>+</button>
                            </div>
                            <div>Total: Rs. {item.Price * item.quantity}</div>
                            <button onClick={() => removeFromCart(item._id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
            <div className="cartTotal">
                <h3>Total Price: Rs. {getTotalPrice()}</h3>
            </div>
        </div>
    );
};

export default Cart;
