import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie to handle cookies
import './styles/customerProfile.css';

const Address = ({ primaryAddress, country, postalCode }) => {
    return (
        <div className="addressBlock">
            <p>{primaryAddress}</p>
            <p>{country}</p>
            <p>{postalCode}</p>
        </div>
    );
};

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
    }, [customerId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!customer) return <p>No customer found</p>;

    const handleLogoutButtonClick = () => {
        Cookies.remove('loggedInUser');  // Remove the cookie on logout
        navigate('/login');
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

    return (
        <div className="layoutFrame">
            <div className="innerFrame">
                <div className="buttonPanel">
                    <h3 onClick={handleProfileButtonClick}>User Profile</h3>
                    <div className="optionBlock">
                        <h4 onClick={handleMyOrdersButtonClick}>View My Orders</h4>  {/* Added My Orders Button */}
                        <h4 onClick={handleMyPaymentsButtonClick}>View My Payments</h4> {/* Changed to View My Payments */}
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
                        {loyaltyStatus === 'approved' ? (
                            <div style={{
                                borderRadius: '8px',
                                padding: '10px',
                                backgroundColor: '#a7ffa7',
                                boxShadow: '0px 3px 5px rgba(128, 128, 128, 0.85)',
                                textAlign: 'center',
                                margin: '15px 0',
                                fontFamily: 'Arial, sans-serif',
                                maxWidth: '300px',
                                margin: 'auto'
                            }}>
                                <p style={{
                                    color: '#004e00',
                                    fontSize: '0.75em',
                                    fontWeight: 'bold',
                                    lineHeight: '1.4',
                                    marginBottom: '10px'
                                }}>
                                    "Congratulations! You've unlocked a special 10% discount on your next purchase. Use it on any product you like when you shop with us again. Happy Shopping!"
                                </p>
                                <button style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: '#efffa7',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#004e00'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}>
                                    Shop Now
                                </button>
                            </div>
                        ) : loyaltyStatus === 'rejected' ? (
                            <div style={{
                                borderRadius: '8px',
                                padding: '10px',
                                backgroundColor: '#ffb9b9',
                                boxShadow: '0px 3px 5px rgba(128, 128, 128, 0.85)',
                                textAlign: 'center',
                                margin: '15px 0',
                                fontFamily: 'Arial, sans-serif',
                                maxWidth: '300px',
                                margin: 'auto'
                            }}>
                                <p style={{
                                    color: '#850e06',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    lineHeight: '1.4',
                                    marginBottom: '10px'
                                }}>
                                    "Your loyalty program request has been rejected!"
                                </p>
                            </div>
                        ) : null}
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
