import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Add js-cookie to check cookies
import LoginForm from '../components/loginForm';
import LogoPng from '../components/logoPng';
import { Link } from 'react-router-dom';
import './styles/loginPage.css';

const LoginPage = ({ setCustomerId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const loggedInUser = Cookies.get('customerId');  // Changed to check for 'customerId'
    
    if (loggedInUser) {
      // Redirect to profile if already logged in
      navigate(`/myprofile/${loggedInUser}`);  // Corrected URL to match your profile route
    }
  }, [navigate]);

  return (
    <div className="outerFrame">
      <div className='logoInLogin'>
        <LogoPng widthValue={'75px'} />
      </div>

      <div className="loginFrame">
        <h3>Login</h3>
        <LoginForm setCustomerId={setCustomerId} />
        <a className="forgotLink" href="/reset-password">Forgot Password?</a> {/* Improved link text and URL */}
        <p className='notYet'>
          Don't have an account yet? <Link to={'/register'}><span>Create</span></Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
