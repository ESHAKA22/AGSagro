import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductView.css';
import { useReactToPrint } from "react-to-print";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import Nav from "../Nav/Nav";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Set Axios base URL
  axios.defaults.baseURL = 'http://localhost:8070/api/products';

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8070/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id)); // Remove from UI
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Report generation
  const ComponentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: "Product Summary",
    onAfterPrint: () => alert("User Report Successfully Downloaded!"),
  });

  // Filtered products based on search term
  const filteredProducts = products.filter(product => 
    product.P_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.Supplier_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div><Nav/>
    
    <div className="product-view">
      <h1 className="header">Products</h1>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div ref={ComponentsRef}>
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Supplier ID</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th className="actions-column">Actions</th> {/* Mark this column to hide on print */}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.P_Image} alt={product.P_name} width="100" height="100" />
                </td>
                <td>{product._id}</td>
                <td>{product.P_name}</td>
                <td>{product.Category}</td>
                <td>{product.Manufacture}</td>
                <td>{product.Supplier_ID}</td>
                <td>{product.Description}</td>
                <td>{product.Quantity}</td>
                <td>{product.Price}</td>
                <td className="actions-column">
                  <button 
                    className="update-button" 
                    onClick={() => navigate(`/productview/${product._id}`)}
                    title="Update"
                  >
                    <FaEdit /> Update
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDelete(product._id)}
                    title="Delete"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="report-button" onClick={handlePrint}>Download Report</button>
    </div>
    </div>
  );
};

export default ProductView;
