import React, { useEffect, useState } from 'react';
import './CSS/SellerSettings.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import upro from '../Components/Assets/upro.PNG';
import pp from '../Components/Assets/pp.jpg';
import logot from '../Components/Assets/logot.PNG';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SellerSettings = () => {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem('access_token');

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Seller logged out successfully');
      } else {
        console.warn('⚠️ Seller logout failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Network error during seller logout:', error);
    }

    // Clear tokens regardless of API response
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/'); // or navigate('/')
  };

   useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = await getAccessToken();
          const res = await fetch(`${BASE_URL}/v1/auth/profile`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
          } else {
            console.error('❌ Error fetching user:', data.message);
          }
        } catch (err) {
          console.error('❌ Network error:', err);
        }
      };
  
      fetchUser();
    }, []);
  
    if (!user) return <div>Loading...</div>;

  return (
    <div className="cart-container5">
      {/* Header */}
      <div className="header2">
        <Link to="/seller_dashboard">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Settings</h2>
      </div>

      <br />
      <div className="chat-ap">
        <div className="header-left">
           <img
                          src={user.image || pp}
                          alt="profile"
                          className="profile-pic"
                          style={{ width: '60px', height: '60px' }}
                        />
          <div className="navt">
            <h2 className="welcome-message1">{user.full_name}</h2>
            <p className="par1">#seller</p>
          </div>
        </div>

        <br />
        <hr />

        <Link to="/seller_password_changing" style={{ textDecoration: 'none' }}>
          <div className="order-status-card4">
            <div className="status-content">
              <div className="status-text-group1">
                <MdLock className="gift-icon2" style={{ color: '#333' }} />
                <p className="rate-title">Change Password</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/edit_seller_profile" style={{ textDecoration: 'none' }}>
          <div className="order-status-card4">
            <div className="status-content">
              <div className="status-text-group1">
                <img src={upro} alt="odel" style={{ width: '40px', height: '50px' }} />
                <p className="rate-title">Update Profile</p>
              </div>
            </div>
          </div>
        </Link>

        <div
          className="order-status-card4"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <div className="status-content">
            <div className="status-text-group1">
              <img src={logot} alt="odel" />
              <p className="rate-title">Log out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
