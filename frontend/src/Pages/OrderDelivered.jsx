import React from 'react';
import './CSS/OrderDelivered.css';
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import odel from '../Components/Assets/odel.png'



const OrderDelivered = () => {
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
        <p className="status-text">Your order is delivered</p>
        <p className="status-subtext">Rate product to get 5 points for collect.</p>
      </div>
        <img src={odel} alt="odel" className="status-icon3" />
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

<Link to="/product_rating" style={{ textDecoration: "none" }}>
<button type="submit" className="make-payment-button">Rate</button></Link>
<Link style={{ width:'100%', textDecoration: "none" }} to='/home'>  
<button type="submit" className="continue-shopping-button1">Return Home</button>
</Link> 

</div>
  )
}

export default OrderDelivered
