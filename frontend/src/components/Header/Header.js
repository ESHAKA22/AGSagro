// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/logoH.png';
import userIcon from '../../assets/images/user-icon.png';
import cartIcon from '../../assets/images/cart-icon.png'; // Import your cart icon image

const Header = () => {
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
          {/* Cart Icon */}
          <li className="cart-icon-item">
            <Link to="/myCart"> 
              <img src={cartIcon} alt="Cart Icon" className="cart-icon" />
            </Link>
          </li>
          {/* User Icon */}
          <li className="user-icon-item">
            <Link to="/login"> 
              <img src={userIcon} alt="User Icon" className="user-icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
