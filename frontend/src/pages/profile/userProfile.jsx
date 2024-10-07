import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie to handle cookies
import './styles/customerProfile.css';

// Address component to display address details
const Address = ({ primaryAddress, country, postalCode }) => {
    return (
        <div className="addressBlock">
            <p>{primaryAddress}</p>
            <p>{country}</p>
            <p>{postalCode}</p>
        </div>
    );
};

// DetailsBox component to display customer details in organized sections
const DetailsBox = ({ customer }) => {
    const customerDetails = [
        [
            { label: 'Customer ID', value: customer.id },
            { label: 'NIC Number', value: customer.nic },
            { label: 'Contact Number', value: customer.mobile },
            { label: 'Email', value: customer.email },
        ],
        [
            { label: 'Username', value: customer.username },
            { label: 'Payment Method', value: customer.payMethod },
            { label: 'Address', value: (<Address primaryAddress={customer.address} country={customer.country} postalCode={customer.postalCode} />) },
        ]
    ];

    return (
        <div className="detailsFrame">
            {
                customerDetails.map((block, index) => (
                    <div key={index} className="detailsBox">
                        {
                            block.map((content, itemIndex) => (
                                <div key={itemIndex} className="details">
                                    <p className="datalabel">{content.label}</p>
                                    <p className="dataValue">{content.value}</p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};

const CustomerProfile = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loyaltyStatus, setLoyaltyStatus] = useState(null); // To track loyalty status
    const navigate = useNavigate();

    useEffect(() => {
        // Authentication check
        const customerIdCookie = Cookies.get('customerId');
        if (!customerIdCookie) {
            alert('You are not logged in! Please log in first.');
            navigate('/login'); // Redirect to login page if not authenticated
            return;
        }

        // Fetch customer data from the backend
        fetch(`http://localhost:8070/api/selectedclient?cid=${customerId}`)
            .then(response => response.json())
            .then(data => {
                const formattedCustomer = {
                    id: data.response.cid,
                    firstName: data.response.firstName,
                    lastName: data.response.lastName,
                    username: data.response.userName,
                    country: data.response.country,
                    nic: data.response.nic,
                    mobile: data.response.phone,
                    email: data.response.email,
                    address: data.response.address,
                    city: data.response.city,
                    postalCode: data.response.zipCode,
                    imgPath: `http://localhost:8070/images/${data.response.cid}.jpg`,
                    payMethod: data.response.paymentMethods,
                };
                setCustomer(formattedCustomer);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setError('Error fetching data');
                setLoading(false);
            });

        // Fetch loyalty status for this customer
        fetch(`http://localhost:8070/api/loyalties`)
            .then(response => response.json())
            .then(data => {
                const customerLoyalty = data.response.find(loyalty => loyalty.cid === parseInt(customerId));
                if (customerLoyalty) {
                    setLoyaltyStatus(customerLoyalty.status);
                }
            })
            .catch(error => {
                console.error('Error fetching loyalty data:', error);
            });
    }, [customerId, navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!customer) return <p>No customer found</p>;

    const handleLogoutButtonClick = () => {
        Cookies.remove('customerId');  // Remove customerId cookie
        navigate('/login');  // Redirect to the login page
    };

    const handleUpdateButtonClick = () => {
        navigate(`/customer/myedit/${customerId}`);
    };

    const handleProfileButtonClick = () => {
        navigate(`/myprofile/${customerId}`);
    };

    const handleLoyaltyButtonClick = () => {
        navigate(`/loyalty/${customerId}`);
    };

    const handleMyPaymentsButtonClick = () => {
        navigate(`/mypayments/${customerId}`); // Navigate to MyPayments route
    };

    const handleMyOrdersButtonClick = () => {
        navigate(`/myorders/${customerId}`);  // Navigate to MyOrders route
    };

    const handleViewReturnsButtonClick = () => {
        navigate(`/myreturns/${customerId}`);  // Navigate to the Returns page
    };

    return (
        <div className="layoutFrame">
            <div className="innerFrame">
                <div className="buttonPanel">
                    <h3 onClick={handleProfileButtonClick}>User Profile</h3>
                    <div className="optionBlock">
                        <h4 onClick={handleMyOrdersButtonClick}>View My Orders</h4>  
                        <h4 onClick={handleMyPaymentsButtonClick}>View My Payments</h4> 
                        <h4 onClick={handleViewReturnsButtonClick}>View Returns</h4> {/* View Returns Button */}
                        <h4 onClick={handleLoyaltyButtonClick}>Become a Loyalty Member</h4>
                        <h4 onClick={handleUpdateButtonClick}>Update Profile</h4>
                        <p onClick={handleLogoutButtonClick}>Logout</p>
                    </div>
                </div>
            </div>
            <div className="innerFrame">
                <div className="profileBlock">
                    <div className='profileBox'>
                        <div className='imgBox'>
                            <img src={customer.imgPath} alt="profile-picture" className="profilePicture" />
                        </div>
                        {loyaltyStatus && (
                            <div className={`loyaltyMessage ${loyaltyStatus === 'approved' ? 'approved' : 'rejected'}`}>
                                {loyaltyStatus === 'approved' ? (
                                    <p>"Congratulations! You've unlocked a special discount on your next purchase!"</p>
                                ) : (
                                    <p>"Your loyalty program request has been rejected!"</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="profileBlock">
                    <h3>{customer.firstName + ' ' + customer.lastName}</h3>
                    <DetailsBox customer={customer} />
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
