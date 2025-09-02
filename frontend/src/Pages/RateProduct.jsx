import React, { useState } from 'react';
import './CSS/RateProduct.css';
import { FaArrowLeft, FaGift, FaArrowRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineCheck,
  AiOutlineCamera,
  AiOutlinePicture
} from "react-icons/ai";
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RateProduct = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [image, setImage] = useState(null);
  void image
  const [showPopup, setShowPopup] = useState(false);

  const [isAnonymous, setIsAnonymous] = useState(false); // or false by default


  const location = useLocation();
  const navigate = useNavigate();
 const searchParams = new URLSearchParams(location.search);
const orderItemId = searchParams.get('id');
const orderId = searchParams.get('order');

  // Fetch order details
 
  const handleRating = (value) => setRating(value);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

 const handleSubmit = async () => {
  if (!rating || !orderItemId) {
    alert('Missing rating or order item.');
    return;
  }

  try {
    const token = await getAccessToken();

    const bodyData = {
      rating,
      comment: feedback,
      is_anonymous: isAnonymous,
    };

    const response = await fetch(`${BASE_URL}/v1/order-items/${orderItemId}/reviews`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setShowPopup(true);
    } else {
      alert(data?.message || 'Failed to submit review');
    }
  } catch (err) {
    console.error('Submit error:', err);
    alert('An error occurred');
  }
};


  const closePopup = () => {
    setShowPopup(false);
    navigate('/product_rating');
  };

  return (
    <div className="cart-container4">
      {/* Header */}
      <div className="header4">
<Link to={`/order_delivered?id=${orderId}`}>
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Rate Product</h2>
      </div>

      {/* Order Status */}
      <div className="order-status-card">
        <div className="status-content">
          <div className="status-text-group1">
            <FaGift className="gift-icon" />
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
            className={`star-icon ${value <= rating ? 'filled' : ''}`}
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
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <p className="character-limit">50 characters</p>

     <div style={{ display: 'flex', justifyContent: 'center' }}>
  <label className="anonymous-checkbox">
  <input
    type="checkbox"
    checked={isAnonymous}
    onChange={() => setIsAnonymous(!isAnonymous)}
  />
  <span>Submit anonymously</span>
</label>

</div>


      {/* Image Upload */}
      <div className="upload-container">
        <div className="image-upload-container">
          <label className="image-upload-box">
            <AiOutlinePicture className="image-upload-icon" />
            <input type="file" accept="image/*,video/*" onChange={handleImageChange} hidden />
          </label>
        </div>
        <div className="camera-upload">
          <label>
            <AiOutlineCamera className="camera-icon2" />
            <input type="file" accept="image/*,video/*" capture="environment" onChange={handleImageChange} hidden />
          </label>
        </div>
      </div>

      <button type="submit" onClick={handleSubmit} className="make-payment-button">
        Submit Review
      </button>

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
              We appreciated your feedback. We'll use your feedback to improve your experience.
            </p>
            <button className="popup-done-button" onClick={closePopup}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateProduct;
