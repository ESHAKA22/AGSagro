import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Header() {
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/catalogue">Catalogue</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Order</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Returns</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Supplier</a>
                    </li>
                    <li className="nav-item">
                        {/* Update Contact Us to use Link */}
                        <Link className="nav-link" to="/">Contact Us</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
