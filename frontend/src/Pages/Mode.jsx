import React, { useState } from 'react';
import './CSS/Mode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate  } from 'react-router-dom';




function Mode() {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook


  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const targetRoute = mode === 'buyer' ? '/home' : '/seller_dashboard';
    setTimeout(() => {
      navigate(targetRoute);
    }, 2000); // Delay for 2000 milliseconds (2 seconds)
  };
  

  return (
    <div className="vc">
    <div className="login-container">
      <div className="back-button">
        <Link to="/login">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>

      <h2>Choose Mode</h2>
      <p>You can switch mode later in your dashboard</p>

      <div className="mode-options">
        <div
          className={`mode-option ${selectedMode === 'buyer' ? 'active' : ''}`}
          onClick={() => handleModeChange('buyer')}
        >
          <div className={`header-container ${selectedMode === 'buyer' ? 'active' : ''}`}>
            <h3>Buyer Mode</h3>
          </div>
          <hr className={`hover-line ${selectedMode === 'buyer' ? 'active' : ''}`} />
          <p>Browse and purchase unique second-hand items and local artisan crafts.</p>
          {selectedMode === 'buyer' ? (
            <div className="check-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.5 10.5L8.5 14.5L15.5 7.5"
                  stroke="#280769"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="radio-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#280769" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>

        <div
          className={`mode-option ${selectedMode === 'seller' ? 'active' : ''}`}
          onClick={() => handleModeChange('seller')}
        >
          <div className={`header-container ${selectedMode === 'seller' ? 'active' : ''}`}>
            <h3>Seller Mode</h3>
          </div>
          <hr className={`hover-line ${selectedMode === 'seller' ? 'active' : ''}`} />
          <p>List your items effortlessly and connect with buyers in your area.</p>
          {selectedMode === 'seller' ? (
            <div className="check-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.5 10.5L8.5 14.5L15.5 7.5"
                  stroke="#280769"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="radio-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#280769" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Mode;