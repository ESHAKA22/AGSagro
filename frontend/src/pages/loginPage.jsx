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
    const loggedInUser = Cookies.get('loggedInUser');
    
    if (loggedInUser) {
      // Redirect to profile if already logged in
      navigate(`/profile/${loggedInUser}`);
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
