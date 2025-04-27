import React, { useState } from 'react';
import './CSS/RateProduct.css';
import { FaArrowLeft, FaGift, FaArrowRight  } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiOutlineCheck, AiOutlineCamera, AiOutlinePicture } from "react-icons/ai";



const RateProduct = () => {

    const [rating, setRating] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
  
    const handleRating = (value) => {
      setRating(value);
    };
  
    const handleSubmit = () => {
      setShowPopup(true);
    };
  
    const closePopup = () => {
      setShowPopup(false);
    };
  
  return (
     <div className="cart-container4">
        {/* Header */}
        <div className="header4">
        <Link to="/order_delivered">
          <FaArrowLeft className="back-icon2" />
          </Link>
          <h2 className="header-title3">Rate Product</h2>
        </div>
    
         {/* Order Status */}
      <div className="order-status-card">
        <div className="status-content">
          <div className="status-text-group1">
          <FaGift className="gift-icon" /> {/* Gift icon added */}
          <p className="rate-title">Submit your review to get 5 points</p>
          </div>
          <FaArrowRight className="back-icon3" />
        </div>
      </div>
    
    
      {/* Star Rating */}
      <div className="stars-container">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              onClick={() => handleRating(value)}
              className={`star-icon ${value <= rating ? "filled" : ""}`}
            >
              {value <= rating ? <AiFillStar /> : <AiOutlineStar />}
            </span>
          ))}
        </div>

        {/* Feedback Textarea */}
        <textarea
          placeholder="Would you like to write anything about this product?"
          maxLength="50"
          className="feedback-textarea"
        ></textarea>
        <p className="character-limit">50 characters</p>

        {/* Image and Camera Upload */}
        <div className="upload-container">
          <div className="image-upload-container">
            {[1].map((_, index) => (
                <div key={index} className="image-upload-box">
                <AiOutlinePicture className="image-upload-icon" />
              </div>
            ))}
          </div>
          <div className="camera-upload">
            <AiOutlineCamera className="camera-icon2" />
          </div>
        </div>

    <Link to="/product_rating" style={{ textDecoration: "none" }}>
    <button type="submit" onClick={handleSubmit} className="make-payment-button">Submit Review</button></Link>
    
    {/* Popup Modal */}
    {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
          <div className="popup-icon-container">
      <div className="outer-circle"></div>
      <div className="inner-circle">
        <AiOutlineCheck className="checkmark-icon" />
      </div>
    </div>
            <h3 className="popup-title">Thank you for your feedback!</h3>
            <p className="popup-message">
              We appreciated your feedback. We'll use your feedback to improve
              your experience.
            </p>
            <button className="popup-done-button" onClick={closePopup}>
              Done
            </button>
          </div>
        </div>
      )}
    
    </div>
  )
}

export default RateProduct
