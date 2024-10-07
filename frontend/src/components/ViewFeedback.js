import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('http://localhost:8070/feedback/view');
                setFeedbacks(res.data);
            } catch (error) {
                console.error("There was an error fetching the feedback!", error);
            }
        };
        fetchFeedbacks();
    }, []);

    const deleteFeedback = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axios.delete(`http://localhost:8070/feedback/delete/${id}`);
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
            } catch (error) {
                console.error("There was an error deleting the feedback!", error);
            }
        }
    };

    return (
        <div className="container">
            <h2>Customer Feedbacks</h2>
            <ul className="list-group">
                {feedbacks.map(feedback => (
                    <li key={feedback._id} className="list-group-item">
                        <p><strong>Name:</strong> {feedback.fullName}</p>
                        <p><strong>Email:</strong> {feedback.email}</p>
                        <p><strong>Phone:</strong> {feedback.phone}</p>
                        <p><strong>Comments:</strong> {feedback.comments}</p>
                        <button
                            onClick={() => navigate(`/edit-feedback/${feedback._id}`)}
                            className="btn btn-primary"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteFeedback(feedback._id)}
                            className="btn btn-danger ml-2"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
