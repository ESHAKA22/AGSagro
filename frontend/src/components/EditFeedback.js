import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditFeedback() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({
        fullName: "",
        email: "",
        phone: "",
        checkInDate: "",
        hearAboutUs: "",
        purposeOfVisit: "",
        serviceRating: "",
        comments: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:8070/feedback/view/${id}`)
            .then((res) => {
                setFeedback(res.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the feedback!", error);
            });
    }, [id]);

    const updateFeedback = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8070/feedback/edit/${id}`, feedback);
            alert("Feedback updated successfully!");
            navigate("/add-feedbacklist"); // Redirect to feedback list
        } catch (error) {
            console.error("There was an error updating the feedback!", error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={updateFeedback}>
                <h2>Edit Feedback</h2>
                <input type="text" value={feedback.fullName} onChange={(e) => setFeedback({ ...feedback, fullName: e.target.value })} placeholder="Full Name" />
                <input type="email" value={feedback.email} onChange={(e) => setFeedback({ ...feedback, email: e.target.value })} placeholder="Email" />
                <input type="tel" value={feedback.phone} onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })} placeholder="Phone" />
                <input type="date" value={feedback.checkInDate} onChange={(e) => setFeedback({ ...feedback, checkInDate: e.target.value })} />
                <input type="text" value={feedback.hearAboutUs} onChange={(e) => setFeedback({ ...feedback, hearAboutUs: e.target.value })} placeholder="How did you hear about us?" />
                <input type="text" value={feedback.purposeOfVisit} onChange={(e) => setFeedback({ ...feedback, purposeOfVisit: e.target.value })} placeholder="Purpose of Visit" />
                
                {/* Service Rating */}
                <fieldset>
                    <legend>How was our service?</legend>
                    {["Very Good", "Good", "Bad"].map((rating) => (
                        <div key={rating}>
                            <input type="radio" name="serviceRating" value={rating} checked={feedback.serviceRating === rating} onChange={(e) => setFeedback({ ...feedback, serviceRating: e.target.value })} />
                            <label>{rating}</label>
                        </div>
                    ))}
                </fieldset>

                <textarea value={feedback.comments} onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })} placeholder="Comments" />
                <button type="submit" className="btn btn-success">Update Feedback</button>
            </form>
        </div>
    );
}
