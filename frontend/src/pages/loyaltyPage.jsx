import React from 'react'
import SidePanel from '../components/sidePanel';
import './styles/layout.css'
import './styles/loyaltyPage.css'
import { useNavigate, useParams } from 'react-router-dom';

// remove this when backend connected
import customers from '../components/tempData'

const Advertisment = () => {
  const { customerId } = useParams();
  return (
    <div className='adFrame'>
      <div className='adBlock'>
        <p>Would you like</p>
        <h3>10% OFF</h3>
        <p>Your Next <span>Purchase</span></p>
        <a href={`/loyalty/apply/${customerId}`}>Become a Member</a>
      </div>
    </div>
  )
}



const LoyaltyPage = () => {

  const { customerId } = useParams();
  const navigate = useNavigate()

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
      <div className="sideBar">
        <p onClick={handleProfileButtonClick}>User Profile</p>
        <p onClick={handleLoyaltyButtonClick}>Become a Loyalty Member</p>
        <p onClick={handleLogoutButtonClick}>Log Out</p>
        </div>
      </div>
      <div className="innerFrame">
        <div class="loyaltyFrame">
          <Advertisment />
        </div>
        <div class="loyaltyFrame">
          <a  href={`/loyalty/apply/${customerId}`}>
            <div class="loyaltyBlock">
              <h3>Apply</h3>
              <p>Apply as a member to start enjoying the loyalty program</p>
            </div>
          </a>
          <a href="">
            <div class="loyaltyBlock">
              <h3>Get Offer</h3>
              <p>Enjoy a 10% discount on your next purchase! Shop now and get 10% off all products on your next visit. Don t miss out!</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyPage