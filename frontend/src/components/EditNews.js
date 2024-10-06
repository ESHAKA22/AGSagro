import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await fetch(`http://localhost:8070/news/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log('Fetched news item:', data); // Log fetched item
                setTitle(data.title);
                setContent(data.content);
                setImageUrl(data.imageUrl);
            } catch (error) {
                console.error('Error fetching news item:', error);
                setMessage('Failed to fetch news item');
            }
        };
        fetchNewsItem();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedNews = { title, content, imageUrl };

        try {
            const response = await fetch(`http://localhost:8070/news/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedNews),
            });
            if (response.ok) {
                console.log('News updated successfully');
                setMessage('News updated successfully');
                navigate('/news');
            } else {
                const errorData = await response.json();
                console.error('Failed to update news:', errorData.message);
                setMessage('Failed to update news');
            }
        } catch (err) {
            console.error('Error updating news:', err);
            setMessage('Error updating news');
        }
    };

    return (
        <div>
            <h2>Edit News</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Content:
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                </label>
                <label>
                    Image URL:
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </label>
                <button type="submit">Update News</button>
            </form>
        </div>
    );
};

export default EditNews;
