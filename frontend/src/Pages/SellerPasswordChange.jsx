import React, { useState } from 'react';
import './CSS/SellerPasswordChange.css';
import { AiOutlineUser } from 'react-icons/ai';
import locka from '../Components/Assets/locka.PNG';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaArrowLeft, FaEyeSlash, FaEye, FaBoxOpen } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;



const SellerPasswordChange = () => {

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
    <div className="app">
                          {/* Header Section */}
                                  <div className="header4" style={{ background: "#ffffff" }}>
                                    <Link to="/seller_profile_settings">
                                      <FaArrowLeft className="back-icon5" />
                                    </Link>
                                    <h2 className="header-title3">Change Password</h2>
                                    
                                  </div>
                          
                          <div className='chat-ap' >
                          <div className="pc">  
                                                          <div className="profile-pic-container" style={{ position: "relative" }}>
                                      <img
                                        src={locka}
                                        alt=""
                                        style={{ width: "250px", height: "250px"}}
                                        className="profile-pic"
                                      />
                                      
                                    </div>
                                    <h3 className="header-title3" style={{ color: "#555"}}>
                                    Your New Password Must be Different from Previously Used Password
                                    </h3>
                                    </div>
                         
    
                          <form onSubmit={handleSubmit} className='pasf'>
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
                           {/* Plus Icon */}
                           <Link to="/add_items" style={{ textDecoration: "none" }}>
                           <div className="plus-icon-wrapper">
                           <FiPlus className="plus-icon" />
                           <div className="horizontal-lines"></div>
                          </div></Link> 
                           {/* Bottom Navigation */}
                          <nav className="bottom-nav2">
                                  <Link to="/seller_dashboard" style={{ textDecoration: "none" }}>
                                    <button className="nav-button2">
                                      <FaHome className="nav-icon2" />
                                      <span className="nav-label2">Home</span>
                                    </button>
                                  </Link>
                                  <Link to="/items_list" style={{ textDecoration: "none" }}>
                                    <button className="nav-button2">
                                      <FaClipboardList className="nav-icon2" />
                                      <span className="nav-label2">Listings</span>
                                    </button>
                                  </Link>
                                  <Link to="/buyers_chat" style={{ textDecoration: "none" }}>
                                    <button className="nav-button2">
                                      <FaComment className="nav-icon2" />
                                      <span className="nav-label2">Messages</span>
                                    </button>
                                  </Link>
                                   <Link to="/seller_orders">
                                          <button className="nav-button">
                                          <FaBoxOpen  className="nav-icon" />
                                          <span className="nav-label">Buyer Orders</span>
                                          </button></Link>
                                  <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
                                    <button className="nav-button2">
                                      <AiOutlineUser className="nav-icon2" />
                                      <span className="nav-label2">Profile</span>
                                    </button>
                                  </Link>
                                </nav>
                        </div>
  )
}

export default SellerPasswordChange
