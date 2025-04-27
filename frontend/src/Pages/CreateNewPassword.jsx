import React from 'react'
import './CSS/CreateNewPassword.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FaEyeSlash  } from 'react-icons/fa';



const CreateNewPassword = () => {
  return (
    <div className="cnp">
      <div className="login-container">
      <div className="back-button">
        <Link to="/login">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>
        <h2 className="welcome-message">Create New Password</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email new password</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Confirm password</label>
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
          <Link style={{ width:'100%' }} to=''><button type="submit" className="login-button">Confirm</button></Link>
          <p className="or">Or</p>
         
          <p className="signup-link">
            Go back to <Link style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }} to='/login'>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
