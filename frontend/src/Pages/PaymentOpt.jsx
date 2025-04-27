import React from 'react';
import './CSS/PaymentOpt.css'
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import {  FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';


const PaymentOpt = () => {
  return (
     <div className="cart-container">
                  {/* Header */}
                  <div className="header2">
                  <Link to="/home">
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

         {/* Select Payment Option Overlay */}
  <div className="payment-overlay">
    <div className="payment-container">
      <h3 className="payment-title">Select Payment Option</h3>
      <div className="payment-option">
        <span className="payment-text">Credit/Debit Card</span>
        <input type="radio" name="payment" value="credit" />
      </div>
      <div className="payment-option">
        <span className="payment-text">Paypal</span>
        <input type="radio" name="payment" value="paypal" />
      </div> 
      <Link to="/make_payment" style={{ textDecoration: "none" }}>
      <button type="submit" className="proceed-button">Proceed</button></Link>
    </div>
  </div>
            
                  {/* Bottom Navigation */}
                        <nav className="bottom-nav">
                       <Link to="/home" style={{ textDecoration: "none" }}>
                             <button className="nav-button">
                             <FaHome className="nav-icon" />
                             <span className="nav-label">Home</span>
                                   </button></Link>
                                   <Link to="/cart_items" style={{ textDecoration: "none" }}>
                             <button className="nav-button">
                             <FaShoppingCart className="nav-icon" />
                             <span className="nav-label">Cart</span>
                                   </button></Link>
                         <Link to="/orders_product" style={{ textDecoration: "none" }}>
                              <button className="nav-button">
                              <FaClipboardList className="nav-icon" />
                              <span className="nav-label">Orders</span>
                              </button></Link>
                            <Link to="/settings" style={{ textDecoration: "none" }}>
                              <button className="nav-button">
                              <FaCog className="nav-icon" />
                              <span className="nav-label">Settings</span>
                              </button></Link>
                      </nav>
                  </div>
  )
}

export default PaymentOpt
