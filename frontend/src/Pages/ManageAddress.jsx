import React from 'react';
import './CSS/ManageAddress.css';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const ManageAddress = () => {
  return (
    <div className="cart-container5">
                {/* Header */}
                               <div className="header2">
                               <Link to="/settings">
                                     <FaArrowLeft className="back-icon2" />
                                   </Link>
                                   <h2 className="header-title3">Manage Delivery Address</h2>
                               </div>
                        
                               <div className="chat-ap">
                               <h2 className="welcome-message">Shop within Location</h2>
                              <p className="par">Tap to edit/delete addresses for your home, place of business, preferred location,
                              and many more.</p>
               
               <div className="order-status-card1">
                                 <div className="status-content">
                                   <div className="status-text-group1">
                                   <FaMapMarkerAlt  className="gift-icon2" /> {/* Gift icon added */}
                                   <p className="rate-title">Add New Address</p>
                                   </div>
                                   <Link to="/address_adding">
                                   <FaArrowRight className="back-icon5" /></Link>
                                 </div>
                               </div>
             </div>
             </div>
  )
}

export default ManageAddress
