import React from 'react';
import './CSS/Cart.css'
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import product_1 from "../Components/Assets/product_1.png";
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import {  FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';


const Cart = () => {
  return (
    <Link to="/cart_item" style={{ textDecoration: "none" }}>
    <div className="cart-container">
      {/* Header */}
      <div className="header2">
      <Link to="/home">
        <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">My Cart (1)</h2>
        <Link to="/cart_items">
        <div className="cart-icon-container">
          <AiOutlineShoppingCart className="cart-icon" />
          <span className="cart-count">1</span>
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
      </Link>
  )
}

export default Cart
