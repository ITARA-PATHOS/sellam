import React from 'react';
import './CSS/Settings.css';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdLock } from 'react-icons/md'; // Material Design Icons
import { FaUniversity } from 'react-icons/fa';   // FontAwesome Icons
import { FiTrash2 } from "react-icons/fi";


const Settings = () => {
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
         
         {/* Settings Cards */}
          <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <MdLock className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">Change Password</p>
                    </div>
                    <Link to="/password_changing">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <FaUniversity className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">Manage Address</p>
                    </div>
                    <Link to="/address_management">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>

                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <FiTrash2 className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">Delete Account</p>
                    </div>
                    <Link to="">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
          
        </div>
        </div>
  )
}

export default Settings
