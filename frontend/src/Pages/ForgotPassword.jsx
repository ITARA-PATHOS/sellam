import React, { useState } from 'react';
import './CSS/ForgotPassword.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/v1/auth/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("📩 Forgot Password Response:", data);

      if (data.success) {
        sessionStorage.setItem('resetEmail', email);
        navigate('/verifycode');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="forgp">
      <div className="login-container">
        <div className="back-button">
          <Link to="/login">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>
        <h2 className="welcome-message">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Send</button>
          <p className="or">Or</p>
          <p className="signup-link">
            Go back to <Link to='/login'>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
