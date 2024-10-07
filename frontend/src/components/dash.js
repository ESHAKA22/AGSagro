import React from "react";
import { Link } from "react-router-dom";
import "./Dash.css"; // Keep your styles organized
import ticketsIcon from '../assets/icons/tickets.png';
import feedbackIcon from '../assets/icons/feedback1.png';
import newsIcon from '../assets/icons/news1.png';
import profileIcon from '../assets/icons/home1.png';

const Dash = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Customer Support Dashboard</h1>
        <div className="user-info">
          <p>Hello, Support Agent</p>
          <Link to="/profile">Profile</Link>
        </div>
      </header>
      
      <section className="dashboard-overview">
        <h2>Dashboard Overview</h2>
        <p>
          A comprehensive view of your support activities. Manage tickets, track feedback, and oversee news updates.
        </p>
      </section>
      
      <div className="dashboard-layout">
        <aside className="sidebar">
          <ul>
            <li><Link to="/support-tickets">Support Tickets</Link></li>
            <li><Link to="/feedback-list">Feedback</Link></li>
            <li><Link to="/news/add">Add News</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </aside>
        
        <main className="dashboard-main">
          <div className="dashboard-metrics">
            <div className="metric">
              <h3>Total Tickets</h3>
              <p>250</p>
            </div>
            <div className="metric">
              <h3>Open Tickets</h3>
              <p>75</p>
            </div>
            <div className="metric">
              <h3>Resolved Tickets</h3>
              <p>175</p>
            </div>
            <div className="metric">
              <h3>Customer Feedback</h3>
              <p>120 Responses</p>
            </div>
          </div>
          
          <section className="dashboard-grid">
            <Link to="/support-tickets" className="dashboard-icon">
              <div>
                <img src={ticketsIcon} alt="Tickets" />
                <p>TICKETS</p>
              </div>
            </Link>
            <Link to="/feedback-list" className="dashboard-icon">
              <div>
                <img src={feedbackIcon} alt="Feedback" />
                <p>FEEDBACK</p>
              </div>
            </Link>
            <Link to="/news/add" className="dashboard-icon">
              <div>
                <img src={newsIcon} alt="Add News" />
                <p>ADD NEWS</p>
              </div>
            </Link>
            <Link to="/profile" className="dashboard-icon">
              <div>
                <img src={profileIcon} alt="Home" />
                <p>PROFILE</p>
              </div>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dash;
