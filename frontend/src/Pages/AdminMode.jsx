import React, { useState } from 'react'; 
import './CSS/Mode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AdminMode() {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleModeChange = async (mode) => {
    setSelectedMode(mode);

     // ✅ If admin, skip API and just navigate
    if (mode === "admin") {
      navigate("/admin-login");
      return;
    }
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
        setTimeout(() => {
          if (mode === 'buyer') {
            navigate('/home');
          } else if (mode === 'seller') {
            navigate('/seller_dashboard');
          } 
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
        <p>Dear Admin, Kindly click to proceed!</p>

       

        {/* Admin Section */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
         
          <div
            className={`mode-option ${selectedMode === 'admin' ? 'active' : ''}`}
            onClick={() => !loading && handleModeChange('admin')}
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              maxWidth: '350px',
              margin: '20px auto',
              opacity: loading && selectedMode !== 'admin' ? 0.6 : 1
            }}
          >
            <div className={`header-container ${selectedMode === 'admin' ? 'active' : ''}`}>
              <h3>Admin Mode</h3>
            </div>
            <hr className={`hover-line ${selectedMode === 'admin' ? 'active' : ''}`} />
            <p>Manage app, sellers, and buyers process efficiently at Sellam platform.</p>
            {selectedMode === 'admin' ? (
              <div className="check-mark">✔️</div>
            ) : (
              <div className="radio-button">⚪</div>
            )}
          </div>
        </div>

        {loading && <p style={{ color: '#280769', marginTop: '10px' }}>Saving...</p>}
      </div>
    </div>
  );
}

export default AdminMode;
