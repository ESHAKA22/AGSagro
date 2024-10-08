import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import securePayment from '../assets/images/paymentlogo.png'; // Ensure the path to the secure payment image is correct



const Payment = () => {
    const [bankDetails, setBankDetails] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        branchCode: ''
    });
    const [cartTotal, setCartTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { state } = useLocation();
    const { cart, shippingDetails } = state || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (cart && cart.length > 0) {
            const total = cart.reduce((acc, item) => acc + (item.productId.Price * item.quantity), 0);
            setCartTotal(total);
        }
    }, [cart]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBankDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            const paymentDate = new Date().toLocaleDateString();
            navigate('/order-confirmation', {
                state: {
                    orderId: '670265181f66eb67c5ef7047',
                    cart,
                    shippingDetails,
                    paymentDate,
                    cartTotal
                }
            });
        }, 2000);
    };

  
    

    return (
        <div style={styles.paymentContainer}>
            <h1 style={styles.paymentTitle}>Secure Payment</h1>

            <div style={styles.formAndSummaryContainer}>
                <form style={styles.paymentForm} onSubmit={handleSubmitPayment}>
                    <h2 style={styles.formTitle}>Bank Details</h2>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Account Name</label>
                        <input
                            type="text"
                            name="accountName"
                            value={bankDetails.accountName}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                            placeholder="Enter account holder's name"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                            placeholder="Enter account number"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={bankDetails.bankName}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                            placeholder="Enter bank name"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Branch Code</label>
                        <input
                            type="text"
                            name="branchCode"
                            value={bankDetails.branchCode}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                            placeholder="Enter branch code"
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        {isSubmitting ? 'Processing...' : 'Submit Payment'}
                    </button>
                </form>

                <div style={styles.cartSummary}>
                    <h2 style={styles.cartSummaryTitle}>Cart Summary</h2>
                    <ul style={styles.cartItems}>
                        {cart.map(item => (
                            <li key={item.productId._id} style={styles.cartItem}>
                                <img src={item.productId.P_Image} alt={item.productId.P_name} style={styles.cartItemImg} />
                                <div style={styles.cartItemDetails}>
                                    <p style={styles.cartItemName}>{item.productId.P_name}</p>
                                    <p style={styles.cartItemQuantity}>Quantity: {item.quantity}</p>
                                    <p style={styles.cartItemPrice}>Price: Rs. {item.productId.Price.toLocaleString()}</p>
                                    <p style={styles.cartItemTotal}>Total: Rs. {(item.productId.Price * item.quantity).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3 style={styles.cartTotal}>Total Amount: Rs. {cartTotal.toLocaleString()}</h3>
                    {/* Download receipt button */}
                    
                </div>
            </div>

            {/* Add your secure payment image here */}
            <img src={securePayment} alt="Secure Payment" style={styles.securePaymentImg} />
        </div>
    );
};

// (styles object remains unchanged)
const styles = {
    paymentContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#ffff',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    paymentTitle: {
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '20px'
    },
    securePaymentImg: {
        display: 'block',
        margin: '20px auto',
        width: '500px',
        height: 'auto'
    },
    formAndSummaryContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px'
    },
    paymentForm: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: '400px' // Ensures consistent height for bank details
    },
    formTitle: {
        fontSize: '1.8rem',
        marginBottom: '10px',
        color: '#333'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    formLabel: {
        marginBottom: '8px',
        fontSize: '1.2rem',
        color: '#333'
    },
    formInput: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    cartSummary: {
        flex: 1,
        marginTop: '25px',
        backgroundColor: '#ffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '400px' // Ensures consistent height for cart summary
    },
    cartSummaryTitle: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#333'
    },
    cartItems: {
        listStyle: 'none',
        padding: 0
    },
    cartItem: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    cartItemImg: {
        width: '100px',
        height: '100px',
        objectFit: 'cover'
    },
    cartItemDetails: {
        flex: 1
    },
    cartItemName: {
        fontSize: '1.2rem',
        fontWeight: 'bold'
    },
    cartItemQuantity: {
        marginTop: '5px',
        color: '#666'
    },
    cartItemPrice: {
        marginTop: '5px',
        color: '#666'
    },
    cartItemTotal: {
        fontWeight: 'bold',
        marginTop: '5px',
        color: '#333'
    },
    cartTotal: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginTop: '20px',
        textAlign: 'right'
    },
    downloadReceiptContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '10px'
    },
    downloadBtn: {
        padding: '10px 15px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer'
    },
    submitBtn: {
        padding: '10px 15px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer'
    }
};
export default Payment;
