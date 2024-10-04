import './styles/changeForm.css';
import React, { useState } from "react";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangeForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const updatePassword = async (cid) => {
    
    if (password === confirmPassword) {
      const updatedCustomer = {
        cid: cid,
        userName: userName,
        password: password
      };

      Axios.post('http://localhost:8070/api/updateclient', updatedCustomer)
        .then((response) => {
          alert('Password Updated Successfully, Please Login..!');
          navigate('/login');
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
          alert('Incorrect User name..!');
        });
    } else {
      alert('New password and Confirm password do not matched.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.get('http://localhost:8070/api/clients');
      const clients = response.data.response;

      const user = clients.find((client) => client.userName === userName);

      if (user) {
        updatePassword(user.cid);
      } else {
        alert('Invalid username..!');
      }
    } catch (error) {
      console.error('Axios Error: ', error);
      alert('Failed to fetch client information.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Enter a new password below to change your password</p>

      <div className="formBlock">
        <label>User Name</label>
        <input
          type="text"
          placeholder="Enter your email address"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="formBlock">
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="formBlock">
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangeForm;
