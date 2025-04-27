import React from 'react'
import './CSS/ForgotPassword.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


const ForgotPassword = () => {
  return (
    <div className="forgp">
      <div className="login-container">
      <div className="back-button">
        <Link to="/login">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>
        <h2 className="welcome-message">Forgot Password</h2>
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
          <Link style={{ width:'100%' }} to='/verifycode'><button type="submit" className="login-button">Send</button></Link>
          <p className="or">Or</p>
         
          <p className="signup-link">
            Go back to <Link style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }} to='/login'>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
