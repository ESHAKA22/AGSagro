import React, { useState } from 'react';
import './styles/loginForm.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Import the Cookies library

const LoginForm = ({ setCustomerId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (username === 'admin' && password === 'admin123') {
                alert('Login successful!');
                navigate('/dashboard');
                return;
            }

            const response = await Axios.get('http://localhost:8070/api/clients');
            const clients = response.data.response;

            const user = clients.find(client => client.userName === username && client.password === password);

            if (user) {
                setCustomerId(user.cid); // Store customer ID in state
                Cookies.set('customerId', user.cid, { expires: 1 }); // Store customer ID in a cookie with 1 day expiration
                alert('Login successful!');
                navigate(`/myprofile/${user.cid}`); // Navigate to the profile page with cid
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login Error: ', error);
            setError('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <form className='loginForm' onSubmit={handleLogin}>
            <div className="formBlock">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="formBlock">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit">Login</button>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                    setUsername(credentialResponseDecoded.email);
                    setPassword(credentialResponseDecoded.sub);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </form>
    );
};

export default LoginForm;
