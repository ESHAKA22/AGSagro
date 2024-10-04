import React, { useEffect, useState } from "react";
import { regions, cities, postalCodes, paymentMethods } from './tempData';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles/regForm.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const SelectInputs = ({ labelText, placeHolderText, inputId, selectOptions, value, onChange }) => {
    return (
        <div className="formInput">
            <label htmlFor={inputId}>{labelText}</label>
            <select
                name={inputId}
                id={inputId}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled>{placeHolderText}</option>
                {selectOptions.map((selectOption, index) => (
                    <option key={index} value={selectOption}>{selectOption}</option>
                ))}
            </select>
        </div>
    );
};

const FormalInput = ({ labelText, inputId, inputType, placeHolder, value, onChange }) => {
    return (
        <div className="formInput">
            <label htmlFor={inputId}>{labelText}</label>
            <input
                type={inputType}
                name={inputId}
                id={inputId}
                placeholder={placeHolder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

const RegForm = () => {
    useEffect(() => {
        fetchMaxIdAndSetId();
    }, []);

    const [cid, setCid] = useState(0);
    const [country, setCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nic, setNic] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [payment, setPayment] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const fetchMaxIdAndSetId = async () => {
        try {
            const response = await Axios.get('http://localhost:8070/api/getmaxid');
            const maxId = response.data?.maxId;
            setCid(maxId + 1); // Set cid to maxId + 1
        } catch (error) {
            console.error('Axios Error (getMaxId): ', error);
        }
    };

    const addUser = async (event) => {
        event.preventDefault();

        const payload = {
            cid: cid,
            country: country,
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
            paymentMethods: payment,
            phone: mobile,
            nic: nic,
            zipCode: zipcode,
            userName: username,
            password: password,
            regDate: new Date(), // Use current date
        };

        try {
            const response = await Axios.post('http://localhost:8070/api/createclient', payload);
            // Store the customer ID for later use (e.g., in local storage)
            localStorage.setItem('customerId', response.data.response.cid);

            if (profilePicture) {
                const formData = new FormData();
                formData.append('cid', cid);
                formData.append('file', profilePicture);

                await Axios.post('http://localhost:8070/api/uploadprofilepicture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            alert('Successfully Registered into the System');
            navigate(`/login`);
        } catch (error) {
            console.error('Error during registration: ', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={addUser}>
            <div className="formPhase">
                <div className="regFormBlock">
                    <SelectInputs
                        labelText={'Country/Region'}
                        placeHolderText={'Select Region..'}
                        inputId={'userRegion'}
                        selectOptions={regions}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div className="regFormBlock">
                    <FormalInput
                        labelText={'Full Name'}
                        inputId={'firstName'}
                        inputType={'text'}
                        placeHolder={'Enter your first name..'}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <FormalInput
                        labelText={''}
                        inputId={'lastName'}
                        inputType={'text'}
                        placeHolder={'Enter your last name..'}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <FormalInput
                        labelText={'NIC'}
                        inputId={'userNic'}
                        inputType={'text'}
                        placeHolder={'Enter NIC number..'}
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                    />
                </div>
                <div className="regFormBlock">
                    <FormalInput
                        labelText={'Address'}
                        inputId={'userAddress'}
                        inputType={'text'}
                        placeHolder={'Enter address..'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <SelectInputs
                        labelText={'City'}
                        placeHolderText={'Select your City..'}
                        inputId={'userCity'}
                        selectOptions={cities}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <SelectInputs
                        labelText={'Zip Code'}
                        placeHolderText={'Select your zip code..'}
                        inputId={'userZip'}
                        selectOptions={postalCodes}
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                    />
                </div>
                <div className="regFormBlock">
                    <FormalInput
                        labelText={'Email'}
                        inputId={'userEmail'}
                        inputType={'email'}
                        placeHolder={'Enter your Email..'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormalInput
                        labelText={'Tel'}
                        inputId={'userTell'}
                        inputType={'tel'}
                        placeHolder={'Enter mobile number..'}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>
                <div className="regFormBlock">
                    <SelectInputs
                        labelText={'Payment Method'}
                        placeHolderText={'Select a Payment method..'}
                        inputId={'userPayment'}
                        selectOptions={paymentMethods}
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                    />
                    <FormalInput
                        labelText={''}
                        inputId={'userPicture'}
                        inputType={'file'}
                        placeHolder={'Upload your photo'}
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
            </div>

            <div className="formPhase">
                <div className="regFormBlock">
                    <FormalInput
                        labelText={'User Name'}
                        inputId={'userName'}
                        inputType={'text'}
                        placeHolder={'Enter a username..'}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="regFormBlock">
                    <FormalInput
                        labelText={'Login Password'}
                        inputId={'userPassword'}
                        inputType={'password'}
                        placeHolder={'Create a password..'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormalInput
                        labelText={''}
                        inputId={'userConfirmPassword'}
                        inputType={'password'}
                        placeHolder={'Enter your password again..'}
                    />
                </div>
            </div>

            <div className="checkTerms">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">I have reviewed and consent to the Privacy Policy, which details how my personal information is collected, used, and protected by the System</label>
            </div>

            <p className='notYet'>Are you Registered? <Link to={'/login'}><span>Login</span></Link></p>

            <GoogleLogin
                onSuccess={credentialResponse => {
                    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                    setFirstName(credentialResponseDecoded.name);
                    setEmail(credentialResponseDecoded.email);
                    setUsername(credentialResponseDecoded.email);
                    setPassword(credentialResponseDecoded.sub);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />

            <button type="submit">Agree and Register</button>
        </form>
    );
};

export default RegForm;
