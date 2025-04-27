import React from 'react';
import './CSS/LoginSignup.css'; // Import the CSS file for styling
import { FaGoogle, FaFacebookF, FaTwitter, FaEyeSlash  } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const LoginSignup = () => {
  return (
    <div className="login">
      <div className="login-container">
        <h2 className="welcome-message">Welcome back Alex 👋</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Enter password</label>
            <div className="password-container">
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                required
              />
              <button type="button" className="show-password">
                <FaEyeSlash />
              </button>
            </div>
          </div>
          <div className="remember-me">
            <div>
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <Link style={{ textDecoration: 'underline', color: 'rgb(43, 199, 43)', fontWeight: 'bold' }} to='/forgotpassword'>Forgot Password?</Link>
    
          </div>
          <Link style={{ width:'100%' }} to='/page-loading'><button type="submit" className="login-button">Login</button></Link>
      
          <p className="or">Or</p>
          <div className="social-login">
          <button className="social-button google">
    <FaGoogle className="google-button-icon" />
    <span className="google-button-text">Continue with Google</span>  </button>
  <button className="social-button facebook">
    <FaFacebookF className="social-icon" />
    <span className="google-button-text">Continue with Facebook</span>
  </button>
  <button className="social-button twitter">
    <FaTwitter className="social-icon" />
    <span className="google-button-text">Continue with Twitter</span>
  </button>
          </div>
          <p className="signup-link">
            Don't have an account? <Link style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }} to='/signup'>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
