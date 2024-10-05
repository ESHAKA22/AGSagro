import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart'; // Import the Cart component
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
import MyOrders from './components/MyOrders'; 

import './styles.css';
import './App.css';

function App() {
    const [editData, setEditData] = useState(null);
    const [customerId, setCustomerId] = useState(null); // State to hold customer ID

    // Fetch requests for other components
    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8070/requests');
            // Handle the response if needed
        } catch (error) {
            console.error('There was an error fetching the requests!', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Function to get customerId from cookies (or alternatively use login flow)
    useEffect(() => {
        const getCustomerIdFromCookies = () => {
            const id = document.cookie
                .split('; ')
                .find(row => row.startsWith('customerId='))
                ?.split('=')[1];
            setCustomerId(id);
        };
        getCustomerIdFromCookies();
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
                    <Route path="/catalogue" element={<Products customerId={customerId} />} /> 
                    <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/productview" element={<ProductView />} />
                    <Route path="/products" element={<Products customerId={customerId} />} /> {/* Pass customerId to Products */}
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/inventory" element={<ProductView />} />
                    <Route path="/productview/:id" element={<UpdateProduct />} />

                    {/* Add Cart Route */}
                    <Route path="/cart" element={<Cart customerId={customerId} />} /> {/* Pass customerId to Cart */}

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
                    <Route path="/myorders/:customerId" element={<MyOrders />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
