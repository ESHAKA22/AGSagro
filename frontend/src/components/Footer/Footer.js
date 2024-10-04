import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/images/logoH.png'; // Import logo image

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-section about">
                    <img src={logo} alt="AGS Agro Asia Logo" className="footer-logo" />
                    
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact-form">
                    <h2>Contact</h2>
                    <p><strong>Email:</strong> info@agsagroasia.com</p>
                    <p><strong>Phone:</strong> 0112 879760</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2024 Developed by ITP24L805_03 | All rights reserved
            </div>
        </footer>
    );
}

export default Footer;
