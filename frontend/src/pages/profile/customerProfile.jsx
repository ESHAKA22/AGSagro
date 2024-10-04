import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SidePanel from '../../components/sidePanel';
import '../styles/layout.css';
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
            { label: 'customer id', value: customer.id },
            { label: 'nic number', value: customer.nic },
            { label: 'contact number', value: customer.mobile },
            { label: 'email', value: customer.email },
        ],
        [
            { label: 'username', value: customer.username },
            { label: 'payment method', value: customer.payMethod },
            { label: 'address', value: (<Address primaryAddress={customer.address} country={customer.country} postalCode={customer.postalCode} />) },
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
    const customerId = Cookies.get('customerId'); // Retrieve the customer ID from the cookie
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerId) {
            setError('No customer ID found');
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8070/api/selectedclient?cid=${customerId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.response) {
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
                } else {
                    setError('Customer data not found');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setError('Error fetching data');
                setLoading(false);
            });
    }, [customerId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!customer) return <p>No customer found</p>;

    return (
        <div className="layoutFrame">
            <div className="innerFrame">
                <SidePanel current={'view accounts'} />
            </div>
            <div className="innerFrame">
                <div className="profileBlock">
                    <h5>Customer Profile</h5>
                    <div className='profileBox'>
                        <div className='imgBox'>
                            <img src={customer.imgPath} alt="profile-picture" className="profilePicture" />
                        </div>
                        <h3 style={{
                            left: '0',
                            top: '0',
                            position: 'relative',
                            width: '300px',
                            textAlign: 'right',
                            textTransform: 'capitalize',
                        }}>{customer.firstName + ' ' + customer.lastName}</h3>
                    </div>
                </div>
                <div className="profileBlock">
                    <DetailsBox customer={customer} />
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
