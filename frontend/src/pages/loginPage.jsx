import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/loginForm';
import LogoPng from '../components/logoPng';
import { Link } from 'react-router-dom';
import './styles/loginPage.css';

const LoginPage = ({ isAuthenticated, setCustomerId }) => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Modify as necessary to the appropriate route
    }
  }, [isAuthenticated, navigate]);

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
