import React, { useState } from 'react';
import './CSS/Mode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Mode() {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleModeChange = async (mode) => {
    setSelectedMode(mode);
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/change-mode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      console.log('Change mode response:', data);
      if (data.success) {
        // A slight delay for UX
        setTimeout(() => {
          navigate(mode === 'buyer' ? '/home' : '/seller_dashboard');
        }, 500);
      } else {
        alert(data.message || 'Failed to change mode');
        setLoading(false);
      }
    } catch (err) {
      console.error('Change-mode error:', err);
      alert('Network error. Try again.');
      setLoading(false);
    }
  };


  return (
    <div className="vc">
      <div className="login-container">
        <div className="back-button">
          <Link to="/login"><FaArrowLeft className="back-arrow" /></Link>
        </div>
        <h2>Choose Mode</h2>
        <p>You can switch mode later in your dashboard</p>

        <div className="mode-options">
          {['buyer', 'seller'].map((mode) => (
            <div
              key={mode}
              className={`mode-option ${selectedMode === mode ? 'active' : ''}`}
              onClick={() => !loading && handleModeChange(mode)}
              style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading && selectedMode !== mode ? 0.6 : 1 }}
            >
              <div className={`header-container ${selectedMode === mode ? 'active' : ''}`}>
                <h3>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h3>
              </div>
              <hr className={`hover-line ${selectedMode === mode ? 'active' : ''}`} />
              <p>{mode === 'buyer'
                ? 'Browse and purchase unique second‑hand items and local artisan crafts.'
                : 'List your items effortlessly and connect with buyers in your area.'}
              </p>
              {selectedMode === mode ? (
                <div className="check-mark">✔️</div>
              ) : (
                <div className="radio-button">⚪</div>
              )}
            </div>
          ))}
        </div>
        {loading && <p style={{ color: '#280769', marginTop: '10px' }}>Saving...</p>}
      </div>
    </div>
  );
}

export default Mode;
