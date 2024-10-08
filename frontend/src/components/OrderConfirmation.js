import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import for creating tables
import companyLogo from '../assets/images/logoH.png'; // Import your company logo

const OrderConfirmation = () => {
    const { state } = useLocation();
    const { orderId, cart = [], shippingDetails = {}, paymentDate, cartTotal = 0 } = state || {};
    const navigate = useNavigate();
    const customerId = Cookies.get('customerId'); // Fetch the customerId from cookies

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

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();

        // Load the logo first
        const logo = new Image();
        logo.src = companyLogo; // Use the imported logo
        logo.onload = function () {
            // Add a border frame around the entire PDF
            doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10);

            // Add logo to the top left
            doc.addImage(logo, 'PNG', 10, 10, 50, 20);

            // Header
            doc.setFontSize(20);
            doc.text('Agro Asia', 70, 15); // Company Name

            doc.setFontSize(12);
            doc.text('Main Street , Malabe', 70, 25); // Address Line 1
            doc.text('Colombo 02', 70, 30); // Address Line 2
            doc.text('Phone: (123) 456-7890', 70, 35); // Phone
            doc.text('Email: info@agroasia.com', 70, 40); // Email

            // Separator line
            doc.text('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 10, 45);

            // Issue Date
            doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 160, 20); // Current Date

            // Receipt Title
            doc.setFontSize(18);
            doc.text('Order Confirmation Receipt', 20, 60);

            // Add space between payment date and customer details
            doc.setFontSize(12);
            doc.text(`Order ID: ${orderId}`, 20, 70);
            doc.text(`Payment Date: ${paymentDate}`, 20, 75);

            // Add space for customer details
            doc.text(`Customer Name: ${shippingDetails.firstName} ${shippingDetails.lastName}`, 20, 90);
            doc.text(`Email: ${shippingDetails.email}`, 20, 95);
            doc.text(`Phone: ${shippingDetails.phone}`, 20, 100);
            doc.text(`Shipping Address: ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zipCode}`, 20, 105);

            // Cart Summary Table
            const tableData = cart.map(item => [
                item.productId.P_name,
                item.quantity,
                item.productId.Price.toLocaleString(),
                (item.productId.Price * item.quantity).toLocaleString()
            ]);

            doc.autoTable({
                head: [['Product Name', 'Quantity', 'Unit Price (Rs.)', 'Total Price (Rs.)']],
                body: tableData,
                startY: 120, // Adjusted starting position
                styles: { cellPadding: 5, fontSize: 10, overflow: 'linebreak' },
                headStyles: { fillColor: '#007bff', textColor: 'white', fontSize: 12 },
                margin: { top: 20 },
            });

            // Total Amount
            doc.text(`Total Cart Amount: Rs. ${cartTotal.toLocaleString()}`, 20, doc.autoTable.previous.finalY + 10);

            // Footer
            doc.setFontSize(10);
            doc.text('--------------------------------------------------------------------------------------------------------------------------------------', 10, doc.autoTable.previous.finalY + 20);
            doc.text('Thank you for your purchase!', 20, doc.autoTable.previous.finalY + 30);
            doc.text('Terms and Conditions apply.', 20, doc.autoTable.previous.finalY + 35);

            // Save PDF
            doc.save(`receipt_${orderId}.pdf`);
        };
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Order Confirmation</h2>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Payment Date:</strong> {paymentDate}</p>

            <h2 style={styles.subtitle}>  </h2>
            <p><strong>Name:</strong> {shippingDetails.firstName} {shippingDetails.lastName}</p>
            <p><strong>Email:</strong> {shippingDetails.email}</p>
            <p><strong>Phone:</strong> {shippingDetails.phone}</p>
            <p><strong>Shipping Address:</strong> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.zipCode}</p>

            <h2 style={styles.subtitle}>Cart Summary</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Product Name</th>
                        <th style={styles.tableHeader}>Quantity</th>
                        <th style={styles.tableHeader}>Unit Price (Rs.)</th>
                        <th style={styles.tableHeader}>Total Price (Rs.)</th>
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
            <h2 style={styles.subtitle}>  </h2>
            <h3 style={styles.total}>Total Cart Amount: Rs. {cartTotal.toLocaleString()}</h3>
            <h3 style={styles.thankYou}>Thank you for your purchase!</h3>

            <div style={styles.buttonsContainer}>
                <button onClick={handleConfirm} style={styles.confirmButton}>
                    View Your Orders
                </button>
                <button onClick={handleDownloadReceipt} style={styles.downloadButton}>
                    Download Receipt
                </button>
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop:'20px',
        marginbottom:'50px',
    },
    title: {
        color: '#343a40',
    },
    subtitle: {
        marginTop: '20px',
        color: '#495057',
    },
    total: {
        marginTop: '10px',
        color: '#000000',
    },
    thankYou: {
        marginTop: '10px',
        color: '#000000',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
    },
    tableHeader: {
        border: '1px solid #dee2e6',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#007bff',
        color: 'white',
    },
    buttonsContainer: {
        marginTop: '20px',
    },
    confirmButton: {
        padding: '10px 20px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#28a745',
        color: 'white',
    },
    downloadButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#9b0503',
        color: 'white',
        marginbottom:'20px'
    },
};

export default OrderConfirmation;
