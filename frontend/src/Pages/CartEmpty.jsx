import React from 'react';
import './CSS/CartEmpty.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import {  FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';



const CartEmpty = () => {
  return (
    <div className="cart-container">
    {/* Header */}
    <div className="header2">
    <Link to="/home">
      <FaArrowLeft className="back-icon2" />
      </Link>
      <h2 className="header-title2">My Cart (0)</h2>
      <Link to="/cart_items">
      <div className="cart-icon-container">
        <AiOutlineShoppingCart className="cart-icon" />
        <span className="cart-count">0</span>
      </div>
      </Link>
    </div>

    {/* Empty Cart Section */}
  <div className="empty-cart">
    <div className="cart-icon-empty">
      <AiOutlineShoppingCart className="cart-empty-icon" />
    </div>
    <p className="empty-cart-message">No items yet? Continue shopping to explore more.</p>
    <Link to="/home">
      <button className="explore-button">Explore</button>
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

export default CartEmpty
