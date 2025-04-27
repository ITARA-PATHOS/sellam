import React from 'react';
import product_1 from "../Components/Assets/product_1.png";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";


const ToCheckout = () => {
  return (
    <div className="product-container">
      <div className="header1">
       <Link to="/cart_item">
        <FaArrowLeft className="back-icon1" />
        </Link>
        <Link to="/cart_items">
        <div className="cart-icon-container">
        <AiOutlineShoppingCart className="cart-icon" />
          <span className="cart-count">1</span>
        </div>
        </Link>
      </div>
      <div className="content-wrapper">
        <div className="image-section">
          <img src={product_1} alt="Electric Stand Mixer" className="product-image" />
        </div>
        <div className="details-section">
        
          <h2 className="product-title">Electric Stand Mixer</h2>
          <p className="product-price">$12.99</p>
          <p className="product-condition"><strong>Condition:</strong> Fairly Used</p>
          <p className="product-quality">
            <strong>Quality:</strong> Second-hand product in excellent condition
          </p>
          <p className="product-location"><strong>Location:</strong> Lagos</p>  
        <Link style={{ width:'100%' }} to='/checkout'>          
        <button className="add-to-cart1">Continue to Checkout</button>
</Link>
          
          <Link style={{ width:'100%' }} to='/sellers_chat'>          
                    <button type="submit" className="chat-seller">Chat with Seller</button>
                    </Link>
        </div>
      </div>
    </div>
  )
}

export default ToCheckout
