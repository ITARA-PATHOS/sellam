import React from 'react';
import './CSS/OrderPending.css';
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import tro from '../Components/Assets/tro.png'


const OrderPending = () => {
  return (
     <div className="cart-container4">
        {/* Header */}
        <div className="header4">
        <Link to="/orders_product">
          <FaArrowLeft className="back-icon2" />
          </Link>
          <h2 className="header-title3">Order #1</h2>
        </div>
    
         {/* Order Status */}
      <div className="order-status-card">
        <div className="status-content">
          <div className="status-text-group">
            <p className="status-text">Your order is on the way</p>
            <p className="status-subtext">Click here to track your order</p>
          </div>
        <img src={tro} alt="tro" className="status-icon" />
        </div>
      </div>


      {/* Order Details */}
      <div className="order-details">
        <div className="row">
          <p className="left">Order number</p>
          <p className="right">#1524</p>
        </div>
        <div className="row">
          <p className="left">Tracking Number</p>
          <p className="right">IK28756838</p>
        </div>
        <div className="row">
          <p className="left">Delivery address</p>
          <p className="right">SBI Building, Software Park</p>
        </div>
      </div>

    <Link to="/tracking_package" style={{ textDecoration: "none" }}>
    <button type="submit" className="make-payment-button">Track Package</button></Link>
    <Link style={{ width:'100%', textDecoration: "none" }} to='/home'>  
    <button type="submit" className="continue-shopping-button1">Continue Shopping</button>
    </Link> 
    
    </div>
  )
}

export default OrderPending
