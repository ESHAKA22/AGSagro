import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequestForm from './components/RequestForm';
import EditRequest from './components/EditRequest';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import Dashboard from './pages/dashboardPage';
import CustomersList from './pages/customersList';
import LoyaltyTable from './pages/loyaltyTable';
import ChangePassword from './pages/changePassword';
import LoyaltyApplication from './pages/loyaltyApplication';
import UpdateCustomer from './pages/updateCustomer';
import LoyaltyPage from './pages/loyaltyPage';
import CustomerProfile from './pages/profile/customerProfile';
import UpdateCustomerProfile from './pages/profile/updateCustomerProfile';
import UserProfile from './pages/profile/userProfile';
import UpdateMyProfile from './pages/profile/updateMyProfile';
import ReportGenerate from './pages/reportGenerate';
import ErrorPage from './pages/erroPage'; // Corrected errorPage import
import OrdersPage from './pages/OrdersPage';

import AddProduct from './components/AddProduct/AddProduct';
import Products from './components/Products/Products'; // Import your Products component
import ProductView from './components/ProductView/ProductView';
import ProductDetail from './components/ProductDetail/ProductDetail';
import UpdateProduct from './components/UpdateProduct/UpdateProduct';
import Stat from './components/Status/Stat'

import './styles.css';
import './App.css';

function App() {
    const [editData, setEditData] = useState(null);
    const [customerId, setCustomerId] = useState(null); // State to hold customer ID

    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8070/requests');
            
        } catch (error) {
            console.error('There was an error fetching the requests!', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <Router>
            <div className="container">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage setCustomerId={setCustomerId} />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<CustomersList />} />
                    <Route path="/loyaltyTable" element={<LoyaltyTable />} />
                    <Route path="/change" element={<ChangePassword />} />
                    <Route path="/loyalty/:customerId" element={<LoyaltyPage />} />
                    <Route path="/loyalty/apply/:customerId" element={<LoyaltyApplication />} />
                    <Route path="/update" element={<UpdateCustomer />} />
                    <Route path="/customer/view/:customerId" element={<CustomerProfile />} />
                    <Route path="/customer/edit/:customerId" element={<UpdateCustomerProfile />} />
                    <Route path="/myprofile/:customerId" element={<UserProfile />} />
                    <Route path="/customer/myedit/:customerId" element={<UpdateMyProfile />} />
                    <Route path="/ReportGenerate" element={<ReportGenerate />} />
                    
                    {/* Add the Products route for the catalogue */}
                    <Route path="/catalogue" element={<Products />} /> 
                    <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/" element={<Stat />} />
                    <Route path="/productview" element={<ProductView />} />
                     <Route path="/products" element={<Products />} />
                   <Route path="/products/:id" element={<ProductDetail />} />
                   <Route path="/inventory" element={<ProductView />} />
                  
                   <Route path="/productview/:id" element={<UpdateProduct />} />
                 
                    <Route
                        path="/requests"
                        element={
                            <>
                                <h1>Submit Your Custom Order</h1>
                                <RequestForm fetchRequests={fetchRequests} editData={editData} customerId={customerId} />
                            </>
                        }
                    />

                    
                    <Route path="/edit/:id" element={<EditRequest />} />

                    <Route path="/orders" element={<OrdersPage />} />

                    
                    <Route path="/about" element={<AboutUs />} />

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
