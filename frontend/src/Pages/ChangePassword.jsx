import React, { useState } from 'react';
import './CSS/ChangePassword.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEyeSlash, FaEye } from 'react-icons/fa';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChangePassword = () => {
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  const navigate = useNavigate();


  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const toggleVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.password_confirmation) {
    return alert('New password and confirmation do not match.');
  }

  try {
    const token = await getAccessToken();
    const response = await fetch(`${BASE_URL}/v1/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    if (data.success) {
      alert('Password changed successfully. Please log in again.');
      
      // Optional: Clear token from local storage if needed
      sessionStorage.removeItem('accessToken');

      // Redirect to login page after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      alert(data.message || 'Failed to change password.');
    }
  } catch (err) {
    console.error('Error changing password:', err);
    alert('An error occurred. Please try again later.');
  }
};


 

  return (
    <div className="cart-container5">
      {/* Header */}
      <div className="header2">
        <Link to="/settings">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Change Password</h2>
      </div>

      <div className="chat-ap">
        <h2 className="welcome-message">Create New Password</h2>
        <p className="par">Your new password must be different from previously used passwords</p>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="input-group">
            <label htmlFor="current_password">Current Password</label>
            <div className="password-container">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="current_password"
                placeholder="Enter current password"
                value={form.current_password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => toggleVisibility('current')}
              >
                {showPasswords.current ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <div className="password-container">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => toggleVisibility('new')}
              >
                {showPasswords.new ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="password-container">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="password_confirmation"
                placeholder="Confirm new password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => toggleVisibility('confirm')}
              >
                {showPasswords.confirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button type="submit" className="make-payment-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
