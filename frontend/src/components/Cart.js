import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import '../pages/styles/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [isQuantityChanged, setIsQuantityChanged] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [shippingFee] = useState(300); // Updated shipping fee to 300
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:8070/api/cart', { withCredentials: true });
                setCart(response.data.products);
                initializeCart(response.data.products);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        const getCustomerIdFromCookies = () => {
            const id = document.cookie
                .split('; ')
                .find(row => row.startsWith('customerId='))?.split('=')[1];
            setCustomerId(id);
        };

        fetchCart();
        getCustomerIdFromCookies();
    }, []);

    const initializeCart = (products) => {
        const initialQuantities = {};
        const initialChanges = {};
        let total = 0;

        products.forEach(item => {
            initialQuantities[item.productId._id] = item.quantity;
            initialChanges[item.productId._id] = false;
            total += item.productId.Price * item.quantity;
        });

        setQuantities(initialQuantities);
        setIsQuantityChanged(initialChanges);
        setSubtotal(total);
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { cart } });
    };

    // Vanilla JS Input Spinner Functionality
    const handleQuantityChange = (productId, increment) => {
        const newQuantity = increment ? quantities[productId] + 1 : Math.max(1, quantities[productId] - 1);
        setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
        setIsQuantityChanged(prev => ({ ...prev, [productId]: true }));
    };

    const handleUpdateQuantity = async (productId) => {
        try {
            await axios.put('http://localhost:8070/api/cart/update', {
                productId,
                quantity: quantities[productId]
            }, { withCredentials: true });

            setIsQuantityChanged(prev => ({ ...prev, [productId]: false }));
            updateCartQuantity(productId);
            Swal.fire('Cart updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const updateCartQuantity = (productId) => {
        const updatedCart = cart.map(item => {
            if (item.productId._id === productId) {
                item.quantity = quantities[productId];
            }
            return item;
        });
        const newSubtotal = updatedCart.reduce((acc, item) => acc + item.productId.Price * item.quantity, 0);
        setSubtotal(newSubtotal);
    };

    const handleRemoveFromCart = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item from your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8070/api/cart/remove/${productId}`, { withCredentials: true });
                setCart(cart.filter(item => item.productId._id !== productId));
                updateSubtotalAfterRemoval(productId);
                Swal.fire('Removed!', 'The item has been removed from your cart.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'There was an error removing the product.', 'error');
            }
        }
    };

    const updateSubtotalAfterRemoval = (productId) => {
        const updatedCart = cart.filter(item => item.productId._id !== productId);
        const newSubtotal = updatedCart.reduce((acc, item) => acc + item.productId.Price * item.quantity, 0);
        setSubtotal(newSubtotal);
    };

    const handleClearCart = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to clear your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete('http://localhost:8070/api/cart/clear', { withCredentials: true });
                setCart([]);
                setSubtotal(0);
                Swal.fire('Cart Cleared', 'Your cart has been cleared.', 'success');
            } catch (error) {
                Swal.fire('Error', 'There was a problem clearing your cart.', 'error');
            }
        }
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length > 0 ? (
                <>
                    <p>You have {cart.length} items in your cart</p>
                    <div className="cart-items-list">
                        {cart.map(item => {
                            const unitPrice = item.productId.Price;
                            const totalPrice = unitPrice * quantities[item.productId._id];
                            return (
                                <div key={item.productId._id} className="cart-item">
                                    <img src={item.productId.P_Image} alt={item.productId.P_name} className="product-image" />
                                    <div className="cart-item-details">
                                        <h3>{item.productId.P_name}</h3>
                                        <p>{item.productId.P_description}</p>
                                        <div className="cart-item-price">
                                            <p className="price">Price: Rs. {unitPrice.toLocaleString('en-LK')}</p>
                                            <div className="quantity-controls">
                                                <button 
                                                    className="quantity-button" 
                                                    onClick={() => handleQuantityChange(item.productId._id, false)}
                                                    disabled={quantities[item.productId._id] <= 1}
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={quantities[item.productId._id]} 
                                                    readOnly 
                                                    className="quantity-input"
                                                />
                                                <button 
                                                    className="quantity-button" 
                                                    onClick={() => handleQuantityChange(item.productId._id, true)}
                                                >
                                                    +
                                                </button>
                                                {isQuantityChanged[item.productId._id] && (
                                                    <button 
                                                        className="update-button" 
                                                        onClick={() => handleUpdateQuantity(item.productId._id)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p>Total: Rs. {totalPrice.toLocaleString('en-LK')}</p>
                                    </div>
                                    <button 
                                        className="remove-button" 
                                        onClick={() => handleRemoveFromCart(item.productId._id)}
                                    >
                                        <FaTrash /> 
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <p>Subtotal: Rs. {subtotal.toLocaleString('en-LK')}</p>
                        <p>Shipping Fee: Rs. {shippingFee.toLocaleString('en-LK')}</p>
                        <h4>Total: Rs. {(subtotal + shippingFee).toLocaleString('en-LK')}</h4>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                        <button className="clear-cart-button" onClick={handleClearCart}>
                            Clear Cart
                        </button>
                    </div>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
