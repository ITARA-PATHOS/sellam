import React from 'react';
import './CSS/Settings.css';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdLock } from 'react-icons/md';
import { FaUniversity } from 'react-icons/fa';
import { FiTrash2 } from "react-icons/fi";
import { getAccessToken } from '../utils/token';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


const Settings = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account permanently?");
    if (!confirmDelete) return;

    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/profile`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("Delete response:", data);

      if (data.success) {
        alert('✅ Account deleted successfully.');
        sessionStorage.removeItem('access_token');
        navigate('/login');
      } else {
        alert(data.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Network error. Try again.');
    }
  };

  return (
    <div className="cart-container5">
      {/* Header */}
      <div className="header2">
        <Link to="/home">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Settings</h2>
      </div>

      <div className="chat-ap">
        {/* Change Password */}
        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <MdLock className="gift-icon2" />
              <p className="rate-title">Change Password</p>
            </div>
            <Link to="/password_changing">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        {/* Manage Address */}
        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <FaUniversity className="gift-icon2" />
              <p className="rate-title">Manage Address</p>
            </div>
            <Link to="/address_management">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        {/* Delete Account */}
        <div className="order-status-card1 delete-account-card" onClick={handleDeleteAccount} style={{ cursor: 'pointer' }}>
          <div className="status-content">
            <div className="status-text-group1">
              <FiTrash2 className="gift-icon2" />
              <p className="rate-title">Delete Account</p>
            </div>
            <FaArrowRight className="back-icon5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
