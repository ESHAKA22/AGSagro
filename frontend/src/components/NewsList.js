import React, { useState, useEffect } from 'react';
import './NewsList.css'; // Make sure this CSS file is correctly linked

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8070/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setMessage('Failed to fetch news');
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-list-container">
      <h2 className="news-heading">Company News</h2>
      {message && <p className="message">{message}</p>}
      {news.length === 0 ? (
        <p className="no-news">No news available.</p>
      ) : (
        news.map((newsItem) => (
          <div key={newsItem._id} className="news-item">
            <h3 className="news-title">{newsItem.title}</h3>
            <p className="news-content">{newsItem.content}</p>
            {newsItem.imageUrl && <img src={newsItem.imageUrl} alt={newsItem.title} className="news-image" />}
            <p className="news-date">{new Date(newsItem.date).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
