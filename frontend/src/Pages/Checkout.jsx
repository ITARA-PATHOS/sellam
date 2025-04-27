import React from 'react';
import './CSS/Checkout.css'
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';


const Checkout = () => {
  return (
     <div className="cart-container">
              {/* Header */}
              <div className="header2">
              <Link to="/pre_checkout">
                <FaArrowLeft className="back-icon2" />
                </Link>
                <h2 className="header-title2">Checkout</h2>
                <Link to="/cart_items">
                <div className="cart-icon-container">
                  <AiOutlineShoppingCart className="cart-icon" />
                  <span className="cart-count">1</span>
                </div>
                </Link>
              </div>
        
    
              <div className="cart-summary">
      <div className="sr">
       <div className='summary-row'>
        <span className="summary-label">Subtotal:</span>
        <span className="summary-value">$12.99</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Discount:</span>
        <span className="summary-value">$0.00</span>
      </div>
      </div>
      <div className="summary-row">
        <span className="summary-label">Total Amount:</span>
        <span className="summary-value">$12.99</span>
      </div>
      <Link to="/escrowinfo" style={{ textDecoration: "none" }}>
      <button type="submit" className="continue-button">Escrow Information</button></Link>
        
     
    </div>
    
        
              
              </div>
  )
}

export default Checkout
