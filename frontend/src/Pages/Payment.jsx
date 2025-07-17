import React from 'react';
import './CSS/Payment.css';
import { FaArrowLeft, FaEyeSlash, FaCreditCard } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useCart } from '../Contexts/CartContext';





const Payment = () => {

  const { cartItems } = useCart();
  
  return (
    <div className="cart-container2">
              {/* Header */}
              <div className="header2">
              <Link to="/payment_option">
                <FaArrowLeft className="back-icon2" />
                </Link>
                <h2 className="header-title2">Pay with Card</h2>
                <Link to="/cart_items">
                <div className="cart-icon-container">
                  <AiOutlineShoppingCart className="cart-icon" />
                  <span className="cart-count">{cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}</span>
                </div>
                </Link>
              </div>
        
    
              {/* Instruction Text */}
      <p className="instruction-text">
        Your personal data is safe with us, and no one else will be able to see it.
      </p>

      {/* Card Icon */}
      <div className="card-icon-container">
      <FaCreditCard className="card-icon" />
      <p className="card-icon-text">Please enter your card details</p>
      </div>

      {/* Input Fields */}
      <div className="payment-form">
        <div className="input-group1">
          <FaEyeSlash className="input-icon1" />
          <input type="password" className='payin' placeholder="Enter your 6 Digit Pin" />
        </div>
        <div className="input-row1">
          <div className="input-group1 half-width">
            <FaEyeSlash className="input-icon1" />
            <input className='payin' type="text" placeholder="Expire Date" />
          </div>
          <div className="input-group1 half-width">
            <FaEyeSlash className="input-icon1" />
            <input className='payin' type="text" placeholder="CVV" />
          </div>
        </div>
        <div className="input-group1">
          <FaEyeSlash className="input-icon1" />
          <input className='payin' type="password" placeholder="Your 4 Digit Pin" />
        </div>
      </div>

      <div className="checkbox-container1">
  <label className="checkbox-label1">
    Use as Default
    <input type="checkbox" className="payin1" />
    <span className="custom-checkbox"></span>
  </label>
</div>


      {/* Make Payment Button */}
      <Link style={{ width:'100%', textDecoration:'None' }} to='/payment_order'>  
      <button type="submit" className="make-payment-button">
        Make Payment
      </button>
      </Link> 
      
              </div>
  )
}

export default Payment
