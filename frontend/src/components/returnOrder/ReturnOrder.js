import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './returnOrder.css';

function ReturnOrder() {
  const [returns, setReturns] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await axios.get('http://localhost:8100/returns'); 
        setReturns(response.data.returns || []); 
      } catch (error) {
        console.error('Error fetching return orders:', error);
      }
    };

    fetchReturns();
  }, []); 

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this return order?");
    if (!confirmDelete) return;
    try {
      // Call the backend to delete the return order by ID
      const response = await axios.delete(`http://localhost:8100/returns/${id}`);

      if (response.status === 200) {
        // If successful, filter out the deleted order from the state
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
  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc); // Set the selected image for zoom
  };

  // Function to close the modal
  const closeImageModal = () => {
    setSelectedImage(null); // Close the modal by resetting the selected image
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
              <th>pictures</th>
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
                  <Link to={`/returnOrder/${returnOrder._id}`}>Update</Link>
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
