import React from 'react';
import './CSS/CartItem.css'
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import product_1 from "../Components/Assets/product_1.png";
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import {  FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';
import { useCart } from '../Contexts/CartContext';



const CartItem = () => {
  const { cartItems } = useCart();
  const item = cartItems[0];

  return (
      <div className="cart-container">
          {/* Header */}
          <div className="header2">
          <Link to="/cart_items">
            <FaArrowLeft className="back-icon2" />
            </Link>
            <h2 className="header-title2">My Cart               
            ({cartItems.reduce((total, item) => total + (item.quantity || 1), 0)})
</h2>
            <Link to="/cart_items">
            <div className="cart-icon-container">
              <AiOutlineShoppingCart className="cart-icon" />
              <span className="cart-count">            {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
</span>
            </div>
            </Link>
          </div>
    
          {/* Cart Item */}
          <div className="cart-item">
            <img src={product_1} alt="Men Genuine Leather Bag" className="product-image1" />
            <div className="product-details">
            <div className="product-info">
              <h3 className="product-title2">Men Genuine Leather Bag</h3>
              <p className="product-price">$12.99</p>
              <p className="product-condition"><strong>Condition:</strong> Fairly Used</p>
            </div>
            <div className="delete-icon-container">
            <FiTrash2 className="delete-icon"/>
          </div>
          </div>
          </div>

          <div className="cart-summary">
  <div className="summary-row">
    <span className="summary-label">Subtotal:</span>
    <span className="summary-value">$12.99</span>
  </div>
  <div className="summary-row">
    <span className="summary-label">Total Amount:</span>
    <span className="summary-value">$12.99</span>
  </div>
  <Link to="/pre_checkout" style={{ textDecoration: "none" }}>
  <button type="submit" className="continue-button">Continue</button></Link>
    <Link style={{ width:'100%' }} to='/home'>  
    <button type="submit" className="continue-shopping-button">Continue Shopping</button>
</Link> 
 
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

export default CartItem
