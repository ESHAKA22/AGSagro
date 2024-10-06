import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddNews.css'; // Import the CSS file

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newsList, setNewsList] = useState([]); // Store all news items
  const [message, setMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false); // To track if we are in edit mode
  const [editId, setEditId] = useState(null); // Track the ID being edited
  const navigate = useNavigate();

  // Fetch all news articles on page load
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8070/news');
        if (!response.ok) throw new Error('Failed to fetch news.');
        const data = await response.json();
        setNewsList(data); // Set the news data
      } catch (error) {
        setMessage('Error fetching news.');
      }
    };
    fetchNews();
  }, []);

  // Handle Add/Edit form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newsItem = { title, content, imageUrl };

    try {
      const response = await fetch(
        isEdit ? `http://localhost:8070/news/${editId}` : 'http://localhost:8070/news',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsItem),
        }
      );

      if (!response.ok) throw new Error(isEdit ? 'Failed to update news.' : 'Failed to add news.');

      const result = await response.json();
      setMessage(isEdit ? 'News updated successfully!' : 'News added successfully!');
      setIsEdit(false);
      setEditId(null);
      setTitle('');
      setContent('');
      setImageUrl('');
      setTimeout(() => setMessage(''), 3000);

      // Refetch the news list after adding or editing
      const updatedNewsList = await fetch('http://localhost:8070/news').then((res) => res.json());
      setNewsList(updatedNewsList);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Handle Delete News
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete news.');
      setMessage('News deleted successfully!');
      setTimeout(() => setMessage(''), 3000);

      // Refetch the news list after deletion
      setNewsList(newsList.filter((newsItem) => newsItem._id !== id));
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Handle Edit click
  const handleEdit = (newsItem) => {
    setIsEdit(true);
    setEditId(newsItem._id);
    setTitle(newsItem.title);
    setContent(newsItem.content);
    setImageUrl(newsItem.imageUrl || '');
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit News Article' : 'Add New News Article'}</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          {isEdit ? 'Update News' : 'Add News'}
        </button>
      </form>

      {/* List of existing news with Edit and Delete options */}
      <h2>News List</h2>
      {newsList.length === 0 ? (
        <p>No news available.</p>
      ) : (
        newsList.map((newsItem) => (
          <div key={newsItem._id} className="news-item">
            <h3>{newsItem.title}</h3>
            <p>{newsItem.content}</p>
            {newsItem.imageUrl && <img src={newsItem.imageUrl} alt={newsItem.title} />}
            <p><small>{new Date(newsItem.date).toLocaleDateString()}</small></p>
            <button onClick={() => handleEdit(newsItem)}>Edit</button>
            <button onClick={() => handleDelete(newsItem._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AddNews;
