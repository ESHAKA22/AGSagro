import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to get customerId
import './returnOrder.css';

function ReturnOrder() {
  const [returns, setReturns] = useState([]);
  const customerId = Cookies.get('customerId'); // Get the customer ID from the cookie
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        // Fetch return orders for the specific logged-in customer using customerId
        const response = await axios.get(`http://localhost:8070/returns?customerId=${customerId}`);
        setReturns(response.data.returns || []);
      } catch (error) {
        console.error('Error fetching return orders:', error);
      }
    };

    if (customerId) {
      fetchReturns(); // Fetch returns only if customerId exists
    }
  }, [customerId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this return order?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`http://localhost:8070/returns/${id}`);

      if (response.status === 200) {
        setReturns((prevReturns) => prevReturns.filter((order) => order._id !== id));
        alert("Return order successfully deleted");
      } else {
        alert("Failed to delete return order");
      }
    } catch (error) {
      console.error('Error deleting return order:', error);
      alert("Error occurred while deleting the return order.");
    }
  };

  const handleUpdateClick = (id) => {
    navigate(`/returnOrder/${id}`); // Navigate to the update page for the selected order
  };

  return (
    <div className="return-order-container">
      <h1>Return Orders</h1>
      {returns.length === 0 ? (
        <p>No return orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Pictures</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((returnOrder) => (
              <tr key={returnOrder._id}>
                <td>{returnOrder.ordernu}</td>
                <td>{returnOrder.name}</td>
                <td>{returnOrder.email}</td>
                <td>{returnOrder.phone}</td>
                <td>{returnOrder.qty}</td>
                <td>{returnOrder.reason}</td>
                <td>
                  {returnOrder.image ? (
                    <img src={returnOrder.image} alt="Product" style={{ width: "100px", height: "100px" }} />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleUpdateClick(returnOrder._id)}>Update</button>
                  <button onClick={() => handleDelete(returnOrder._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReturnOrder;
