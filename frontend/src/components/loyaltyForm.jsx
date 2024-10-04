import React, { useEffect, useState } from "react";
import './styles/loyaltyForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';

const LoyaltyForm = ({ customerId }) => {
  const navigate = useNavigate();

  const [loyaltyId, setLoyaltyId] = useState(0);
  const [cid, setCid] = useState(customerId || 0);  // Initialize cid with customerId
  const [cusName, setCusName] = useState('');
  const [Country, setCountry] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    fetchMaxIdAndSetId();
}, []);

  const formInputs = [
    { id: 'customerID', label: 'customer id', placeholder: 'XXX', value: cid, setValue: setCid },
    { id: 'customerName', label: 'customer name', placeholder: 'Enter your Name . .', value: cusName, setValue: setCusName },
    { id: 'customerCountry', label: 'country', placeholder: 'Enter your Country . .', value: Country, setValue: setCountry },
  ];

  const eyeOnRadioButton = (event) => {
    setInfo(event.target.value);
  };

  const handleCancel = () => {
    navigate(`/myprofile/${customerId}`);
  };


  const fetchMaxIdAndSetId = async () => {
    try {
        const response = await Axios.get('http://localhost:8070/api/getloyaltymaxid');
        const maxId = response.data?.maxId;
        setLoyaltyId(maxId + 1);
    } catch (error) {
        console.error('Axios Error (getMaxId): ', error);
    }
};

  const addLoyalty = async (event) => {
    event.preventDefault();
    console.log(cid, cusName, Country, info);

    const payload = {
        loyaltyId: loyaltyId,
        cid: cid,
        cusName: cusName,
        Country: Country,
        info: info,
        status: 'pending',
    };

    Axios.post('http://localhost:8070/api/createloyalty', payload)
        .then((response) => {
          console.log('Done');
          alert('Successfully created Loyalty..!');
          navigate(`/myprofile/${customerId}`);
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
        });
  };

  return (
    <form onSubmit={addLoyalty}>
      {formInputs.map((content, index) => (
        <div key={index} className="lformBlock">
          <label htmlFor={content.id}>{content.label}</label>
          <input
            type="text"
            name={content.id}
            id={content.id}
            placeholder={content.placeholder}
            value={content.value} // Set the value from state
            onChange={(e) => content.setValue(e.target.value)} // Update the corresponding state
            required
          />
        </div>
      ))}

      <div className="lformBlock">
        <p>How would you prefer to receive Information about our Loyalty Program?</p>
        <div className="lformCheck">
          <label htmlFor="byEmail">
            <input
              type="radio"
              name="info"
              id="byEmail"
              value="email"
              checked={info === 'email'}
              onChange={eyeOnRadioButton}
            />
            By Emails
          </label>
          <label htmlFor="bySms">
            <input
              type="radio"
              name="info"
              id="bySms"
              value="sms"
              checked={info === 'sms'}
              onChange={eyeOnRadioButton}
            />
            By Short Message Service (SMS)
          </label>
        </div>
      </div>

      <div className="lformButtons">
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default LoyaltyForm;
