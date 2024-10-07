import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8070/feedback/view')
            .then((res) => {
                setFeedbacks(res.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the feedback!", error);
            });
    }, []);

    const deleteFeedback = (id) => {
        axios.delete(`http://localhost:8070/feedback/delete/${id}`)
            .then(() => {
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
            })
            .catch((error) => {
                console.error("There was an error deleting the feedback!", error);
            });
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
                            onClick={() => window.location.href = `/edit-feedback/${feedback._id}`}
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
