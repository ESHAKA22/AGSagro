// EditRequest.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestForm from './RequestForm';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditRequest = () => {
    const { id } = useParams(); // Get the request ID from the URL
    const [requestData, setRequestData] = useState(null);
    const navigate = useNavigate();

    const fetchRequest = async () => {
        try {
            const response = await axios.get(`http://localhost:8070/requests/${id}`);
            setRequestData(response.data);
        } catch (error) {
            console.error('Error fetching request data:', error);
            toast.error('Error fetching request data.');
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            await axios.put(`http://localhost:8070/requests/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Request updated successfully!');
            navigate('/requests'); // Redirect to requests list after updating
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error('There was an error updating the request.');
        }
    };

    useEffect(() => {
        fetchRequest();
    }, [id]);

    return (
        <div>
            <h1>Edit Request</h1>
            {requestData ? (
                <RequestForm
                    fetchRequests={() => {}}
                    editData={requestData}
                    onFormSubmit={handleFormSubmit}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditRequest;
