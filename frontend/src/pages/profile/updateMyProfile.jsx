import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import SidePanel from '../../components/sidePanel';
import { regions, cities, postalCodes, paymentMethods } from '../../components/tempData';
import '../styles/layout.css';
import './styles/updateCustomerProfile.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectionWithValue = ({ idValue, current, valueArray, onValueChange }) => (
    <select name={idValue} id={idValue} value={current} onChange={(e) => onValueChange(e.target.value)}>
        {valueArray.map((content, index) => (
            <option key={index} value={content}>{content}</option>
        ))}
    </select>
);

const FormalInputWithValue = ({ idValue, type, current, onValueChange }) => (
    <input type={type} name={idValue} id={idValue} value={current} onChange={(e) => onValueChange(e.target.value)} />
);

const UpdateForm = ({ updateWho }) => {
    const { customerId } = useParams(); 
    const [firstName, setFirstName] = useState(updateWho.firstName);
    const [lastName, setLastName] = useState(updateWho.lastName);
    const [userName, setUserName] = useState(updateWho.userName);
    const [email, setEmail] = useState(updateWho.email);
    const [mobileNumber, setMobileNumber] = useState(updateWho.phone);
    const [nicNumber, setNICNumber] = useState(updateWho.nic);
    const [city, setCity] = useState(updateWho.city);
    const [country, setCountry] = useState(updateWho.country);
    const [postalCode, setPostalCode] = useState(updateWho.postalCode);
    const [payMethod, setPayMethod] = useState(updateWho.payMethod);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const navigate = useNavigate()

    
    useEffect(() => {
        setFirstName(updateWho.firstName);
        setLastName(updateWho.lastName);
        setUserName(updateWho.userName);
        setEmail(updateWho.email);
        setMobileNumber(updateWho.phone);
        setNICNumber(updateWho.nic);
        setCity(updateWho.city);
        setCountry(updateWho.country);
        setPostalCode(updateWho.postalCode);
        setPayMethod(updateWho.payMethod);
    }, [updateWho]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedCustomer = {
            cid: customerId,
            firstName,
            lastName,
            userName,
            email,
            phone: mobileNumber,
            nic: nicNumber,
            city,
            country,
            postalCode,
            payMethod
        };

        Axios.post('http://localhost:8070/api/updateclient', updatedCustomer)
            .then((response) => {
                alert('Successfully Updated..!');
                navigate(`/myprofile/${customerId}`);
            })
            .catch((error) => {
                console.error('Axios Error: ', error);
                setUpdateSuccess('Error updating profile');
            });
    };

    const handleReset = () => {
        setFirstName(updateWho.firstName);
        setLastName(updateWho.lastName);
        setUserName(updateWho.userName);
        setEmail(updateWho.email);
        setMobileNumber(updateWho.phone);
        setNICNumber(updateWho.nic);
        setCity(updateWho.city);
        setCountry(updateWho.country);
        setPostalCode(updateWho.postalCode);
        setPayMethod(updateWho.payMethod);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="updateFormRow">
                <FormalInputWithValue idValue={'userFirstName'} type={'text'} current={firstName} onValueChange={setFirstName} />
                <FormalInputWithValue idValue={'userLastName'} type={'text'} current={lastName} onValueChange={setLastName} />
            </div>
            <div className="updateFormRow">
                <FormalInputWithValue idValue={'userName'} type={'text'} current={userName} onValueChange={setUserName} />
            </div>
            <div className="updateFormRow">
                <FormalInputWithValue idValue={'userEmail'} type={'email'} current={email} onValueChange={setEmail} />
                <FormalInputWithValue idValue={'userMobile'} type={'tel'} current={mobileNumber} onValueChange={setMobileNumber} />
            </div>
            <div className="updateFormRow">
                <FormalInputWithValue idValue={'userNIC'} type={'text'} current={nicNumber} onValueChange={setNICNumber} />
            </div>
            <div className="updateFormRow">
                <SelectionWithValue idValue={'userCity'} current={city} valueArray={cities} onValueChange={setCity} />
                <SelectionWithValue idValue={'userCountry'} current={country} valueArray={regions} onValueChange={setCountry} />
            </div>
            <div className="updateFormRow">
                <SelectionWithValue idValue={'userPost'} current={postalCode} valueArray={postalCodes} onValueChange={setPostalCode} />
                <SelectionWithValue idValue={'userPayMethod'} current={payMethod} valueArray={paymentMethods} onValueChange={setPayMethod} />
            </div>
            <div className='updateButtons'>
                <button type="submit"><FontAwesomeIcon icon={faCheck} /></button>
                <button type="button" onClick={handleReset}><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            {updateSuccess && <p>{updateSuccess}</p>}
        </form>
    );
};

const UpdateCustomerProfile = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch customer data from the backend
        fetch(`http://localhost:8070/api/selectedclient?cid=${customerId}`)
            .then(response => response.json())
            .then(data => {
                setCustomer(data.response);

                const picCustomer = {
                    imgPath: `http://localhost:8070/images/${data.response.cid}.jpg`
                }
                setProfilePic(picCustomer);
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

    const handleLogoutButtonClick = () =>{
        navigate('/login');
      }

    const handleProfileButtonClick = () =>{
        navigate(`/myprofile/${customerId}`);
    }

    const handleLoyaltyButtonClick = () =>{
        navigate(`/loyalty/${customerId}`);
    }

    return (
        <div className="layoutFrame">
            <div className="innerFrame">
            <div className="buttonPanel">
                    <h3 onClick={handleProfileButtonClick} >User Profile</h3>
                    <div className="optionBlock">
                        <h4 onClick={handleLoyaltyButtonClick}>Become a loyalty Member</h4>
                        {/* <h4 onClick={handleUpdateButtonClick}>Update Profile</h4> */}
                        <p onClick={handleLogoutButtonClick}>Logout</p>
                    </div>
                </div>
            </div>
            <div className="innerFrame">
                <div className="updateBlock">
                    <h5>Update Customer Details</h5>
                    <div className="updateBox">
                        <div className='imgBox'>
                            <img src={profilePic.imgPath} alt="upload-a-picture" className="profilePicture" />
                        </div>
                        <h3>{customer.firstName + ' ' + customer.lastName}</h3>
                    </div>
                </div>
                <div className="updateBlock">
                    <div className='updateFormBlock'>
                        <UpdateForm updateWho={customer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCustomerProfile;
