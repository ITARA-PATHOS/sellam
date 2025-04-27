import React from 'react';
import './CSS/TrackPackage.css';
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import product_1 from "../Components/Assets/product_1.png";
import { Link } from 'react-router-dom';
import hws from "../Components/Assets/hws.png";


const TrackPackage = () => {
  
  const steps = [
    "Buyer pays",
    "Escrow holds payment",
    "Seller ships",
    "Buyer confirms receipt",
    "Escrow releases payment",
  ];

  const currentStep = 2; // Example: Set the current progress step here.

  return (
    <div className="cart-container6">
    {/* Header */}
    <div className="header2">
    <Link to="/pending_order">
      <FaArrowLeft className="back-icon2" />
      </Link>
      <h2 className="header-title2">Track Package</h2>
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
      
    </div>
    </div>

     {/* Vertical Progress Bar */}
      <div className="vertical-progress">
        <ol className="progress-list">
          {steps.map((step, index) => (
            <li key={index} className="progress-item">
              <div
                className={`progress-marker ${
                  index < currentStep
                    ? "completed-marker"
                    : index === currentStep
                    ? "active-marker"
                    : "default-marker"
                }`}
              >
                {index < currentStep && <span className="check-icon">✔</span>}
              </div>
              <span className="progress-content">{step}</span>
              {index < steps.length - 1 && (
                <div className="vertical-bar-container">
                  <div
                    className={`vertical-bar ${
                      index < currentStep - 1
                        ? "completed-bar"
                        : index === currentStep - 1
                        ? "half-completed-bar"
                        : ""
                    }`}
                  ></div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      {/* Rating Section */}
      <div className="rating-section">
      <img src={hws} alt="Men Genuine Leather Bag" className="product-image2" />
      <div className="product-details2">
      <div className="product-info2">
        <h4>Don't forget to rate</h4>
        <p>Rate product to get 5 points for codes!</p>
        <div className="star-rating5">
          <FaStar className="star-icon5" />
          <FaStar className="star-icon5" />
          <FaStar className="star-icon5" />
          <FaStar className="star-icon5" />
          <FaStar className="star-icon5" />
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPackage
