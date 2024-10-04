import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav>
      <ul className="home-ul">
        <li className="home-ll">
          <Link to="/" className="home-a">
            <h1>Product Statues</h1>
          </Link>
        </li>
        <li className="home-ll">
          <Link to="/AddProduct" className="home-a">
            <h1>Add Product</h1>
          </Link>
        </li>
        <li className="home-ll">
          <Link to="/ProductView" className="home-a">
            <h1>View Products</h1>
          </Link>
        </li>
        <li className="home-ll">
          <Link to="/Products" className="home-a">
            <h1>Products</h1>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
