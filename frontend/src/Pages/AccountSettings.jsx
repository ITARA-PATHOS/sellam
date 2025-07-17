import React, {useState, useEffect} from 'react';
import './CSS/AccountSettings.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaCog, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import tos from '../Components/Assets/tos.PNG';
import logot from '../Components/Assets/logot.PNG';
import support from '../Components/Assets/support.PNG';
import { getAccessToken } from '../utils/token'; // Assumes this exists


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AccountSettings = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
      const fetchUser = async () => {
        const token = await getAccessToken();
        if (!token) return;
  
        try {
          const response = await fetch(
            `${BASE_URL}/v1/auth/profile`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setUserProfile(data.data);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
  
      fetchUser();
    }, []);
  
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
        console.log('✅ Logged out successfully');
      } else {
        console.warn('⚠️ Logout failed or already expired:', data.message);
      }
    } catch (err) {
      console.error('❌ Network error during logout:', err);
    }

    // Clear tokens and redirect regardless
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/'); // or navigate('/')
  };

  return (
    <div className="cart-container6">
      <div className="header2">
        <Link to="/home">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Account Settings</h2>
      </div>

      <div className="chat-ap">
        <div className="order-status-card3">
          <div className="status-text-group">
            <p className="status-text">Hello, {userProfile?.username || 'Guest'}</p>
            <p className="status-subtext">What would you like to do today?</p>
          </div>
        </div>

        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <AiOutlineUser className="gift-icon2" />
              <p className="rate-title">My Profile</p>
            </div>
            <Link to="/edit_profile">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <FaClipboardList className="gift-icon2" />
              <p className="rate-title">My Orders</p>
            </div>
            <Link to="/orders_product">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        <br />

        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <img src={support} alt="odel" />
              <p className="rate-title">Support</p>
            </div>
            <Link to="/buyer_support">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <FaCog className="gift-icon2" />
              <p className="rate-title">Settings</p>
            </div>
            <Link to="/settings">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <img src={tos} alt="odel" />
              <p className="rate-title">Terms Of Service</p>
            </div>
            <Link to="">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        <br />

        <div className="order-status-card1" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div className="status-content">
            <div className="status-text-group1">
              <img src={logot} alt="odel" />
              <p className="rate-title">Logout</p>
            </div>
            <FaArrowRight className="back-icon5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
