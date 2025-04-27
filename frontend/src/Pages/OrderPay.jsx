import React from 'react';
import './CSS/OrderPay.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import ocom1 from '../Components/Assets/ocom1.PNG';




const OrderPay = () => {
  return (
    <div className="cart-container3">
    {/* Header */}
    <div className="header2">
    <Link to="/make_payment">
      <FaArrowLeft className="back-icon2" />
      </Link>
      <h2 className="header-title2">Order Completed</h2>
      <Link to="/cart_items">
      <div className="cart-icon-container">
        <AiOutlineShoppingCart className="cart-icon" />
        <span className="cart-count">1</span>
      </div>
      </Link>
    </div>

     {/* Content */}
     <div className="content">
      <div >
        <img src={ocom1} alt="Half Pie Chart" className="half-pie-image1" />
      </div>
      
        <p className="thank-you-text">
          Thank you for your purchase. <br />
          You can view your order in 'My Orders' section.
        </p>
      </div>


<Link to="/orders_product" style={{ textDecoration: "none" }}>
<button type="submit" className="make-payment-button">Continue</button></Link>
<Link style={{ width:'100%', textDecoration: "none" }} to='/home'>  
<button type="submit" className="continue-shopping-button1">Continue Shopping</button>
</Link> 

</div>


    
  )
}

export default OrderPay
