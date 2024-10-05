import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/logoH.png';
import userIcon from '../../assets/images/user-icon.png';
import Cookies from 'js-cookie'; // Import Cookies library

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const customerId = Cookies.get('customerId'); // Get the customer ID from cookies

    if (customerId) {
      navigate(`/myprofile/${customerId}`); // Redirect to profile if logged in
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="AGS Agro Asia Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/catalogue">Catalogue</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/returns">Returns</Link></li>
          <li><Link to="/supplier">Supplier</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/cart">View My Cart</Link></li> {/* Cart Link */}
          <li className="user-icon-item">
            <button onClick={handleProfileClick} className="user-icon-button">
              <img src={userIcon} alt="User Icon" className="user-icon" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
