import React from 'react';

const OrderSummaryTable = ({ orderId, shippingDetails, cart, cartTotal, paymentDate }) => {
    return (
        <div>
            <h2>Order Confirmation</h2>

            <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th colSpan="2">Order Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Order ID</strong></td>
                        <td>{orderId}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Date</strong></td>
                        <td>{paymentDate}</td>
                    </tr>
                </tbody>

                <thead>
                    <tr>
                        <th colSpan="2">Customer Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Name</strong></td>
                        <td>{shippingDetails.firstName} {shippingDetails.lastName}</td>
                    </tr>
                    <tr>
                        <td><strong>Email</strong></td>
                        <td>{shippingDetails.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Phone</strong></td>
                        <td>{shippingDetails.phone}</td>
                    </tr>
                    <tr>
                        <td><strong>Shipping Address</strong></td>
                        <td>{shippingDetails.address}, {shippingDetails.city}, {shippingDetails.zipCode}</td>
                    </tr>
                </tbody>

                <thead>
                    <tr>
                        <th colSpan="2">Cart Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td>{item.productId.P_name} x {item.quantity}</td>
                            <td>Rs. {(item.productId.Price * item.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total Amount</strong></td>
                        <td><strong>Rs. {cartTotal.toLocaleString()}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default OrderSummaryTable;
