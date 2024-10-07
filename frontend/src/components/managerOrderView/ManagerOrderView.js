import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';  
import './manage.css';

function ManagerOrderView() {
    const [returns, setReturns] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedImage, setSelectedImage] = useState(null); // For modal image
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const response = await axios.get('http://localhost:8070/returns');
                setReturns(response.data.returns || []);
            } catch (error) {
                console.error('Error fetching return orders:', error);
            }
        };
        fetchReturns();
    }, []); 

const approveOrder = async (id) => {
    try {
        const response = await axios.put(`http://localhost:8070/returns/${id}/approve`);
        console.log('API Response:', response.data);
        const approvedOrder = response.data;


        setReturns((prev) => prev.filter(order => order._id !== id)); 

        navigate('/approved', { state: { approvedOrders: [approvedOrder] } });
        console.log('Navigated to Approved page with order:', approvedOrder);


    } catch (error) {
        console.error("Error approving order:", error);
    }
};

const rejectOrder = async (id) => {
    try {
        const response = await axios.put(`http://localhost:8070/returns/${id}/reject`);
        console.log('API Response:', response.data);
        const rejectedOrder = response.data;


        setReturns((prev) => prev.filter(order => order._id !== id)); 

        navigate('/rejected', { state: { rejectedOrders: [rejectedOrder] } });
        console.log('Navigated to Approved page with order:', rejectedOrder);

    } catch (error) {
        console.error("Error rejecting order:", error);
    }
};


    const generatePDF = async(returnOrder) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Return Order Report - Order #${returnOrder.ordernu}`, 20, 20);

        doc.setFontSize(12);
        doc.text(`Return Number: ${returnOrder.ordernu}`,20, 30);
        doc.text(`Name: ${returnOrder.name}`, 20, 40);
        
        if (returnOrder.image) {
            try {
                const imageBase64 = await getBase64ImageFromURL(returnOrder.image);
                doc.addImage(imageBase64, 'JPEG', 80, 50, 50, 50);
            } catch (error) {
                console.error("Error adding image to PDF:", error);
            }
        } else {
            doc.text('No image provided', 20, 90); 
        }
    

        doc.autoTable({
            startY: 150, 
            head: [['Field', 'Value']],
            body: [
                ['Order Number', returnOrder._id],
                ['Name', returnOrder.name],
                ['Email', returnOrder.email],
                ['Phone', returnOrder.phone],
                ['Quantity', returnOrder.qty],
                ['Reason', returnOrder.reason]
            ]
        });

        doc.save(`return_order_${returnOrder.ordernu}.pdf`);
    };

    const getBase64ImageFromURL = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob); 
        });
    };
    

    const filteredReturns = returns.filter((returnOrder) => {
        return (
            returnOrder.ordernu.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            returnOrder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            returnOrder.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc); // Set the image to be shown in the modal
    };

    const closeImageModal = () => {
        setSelectedImage(null); // Close the modal by setting the selected image to null
    };

    return (
        <div className="return-order-container">
            <h1>Return Orders</h1>

            <input 
                type="text" 
                placeholder="Search by order number, name, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-bar"
            />

            {filteredReturns.length === 0 ? (
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
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturns.map((returnOrder) => (
                            <tr key={returnOrder._id}>
                                <td>{returnOrder.ordernu}</td>
                                <td>{returnOrder.name}</td>
                                <td>{returnOrder.email}</td>
                                <td>{returnOrder.phone}</td>
                                <td>{returnOrder.qty}</td>
                                <td>{returnOrder.reason}</td>
                                <td>
                                    {returnOrder.image ? (
                                        <img 
                                            src={returnOrder.image} 
                                            alt="Product" 
                                            style={{ width: "100px", height: "100px", cursor: "pointer" }} 
                                            onClick={() => openImageModal(returnOrder.image)} // Open modal on click
                                        />
                                    ) : (
                                        <span>No image</span>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => approveOrder(returnOrder._id)}>Approve</button>
                                    <button onClick={() => rejectOrder(returnOrder._id)}>Reject</button>
                                    <button onClick={() => generatePDF(returnOrder)}>Generate PDF</button> {/* PDF button */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal for zooming in on the image */}
            {selectedImage && (
                <div className="modal">
                    <span className="close" onClick={closeImageModal}>&times;</span>
                    <img className="modal-content" src={selectedImage} alt="Zoomed Product" />
                </div>
            )}
        </div>
    );
}

export default ManagerOrderView;
