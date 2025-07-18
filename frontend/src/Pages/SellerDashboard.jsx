import React, { useEffect, useState, useContext } from 'react';
import './CSS/SellerDashboard.css';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaBoxOpen, FaTrash } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { getAccessToken } from '../utils/token';
import { getFcmToken } from '../utils/fcm';
import pp from '../Components/Assets/pp.jpg';
import tl from "../Components/Assets/tl.PNG";
import ts from "../Components/Assets/ts.PNG";
import { ProductContext } from '../Contexts/ListingContext';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;



const SellerDashboard = () => {
  const navigate = useNavigate();
  const { myProducts, deleteProduct, markAsSold} = useContext(ProductContext);
  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
const [hasUnread, setHasUnread] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);

void notifications
void hasUnread

useEffect(() => {
  const fetchNotifications = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
        const unreadExists = json.data.some(n => !n.is_read);
        setHasUnread(unreadExists);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  fetchNotifications();
}, []);

useEffect(() => {
  const fetchUnreadCount = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications/unread`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setUnreadCount(json.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  fetchUnreadCount();
}, []);

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
          console.error('Error fetching user:', data.message);
        }
      } catch (err) {
        console.error('Network error:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = await getAccessToken();

      // 1. Fetch Seller Profile
      const profileRes = await fetch(`${BASE_URL}/v1/auth/profile`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const profileJson = await profileRes.json();
      if (profileJson.success) {
        setUser(profileJson.data);
      }

      // 2. Fetch Dashboard Stats (placeholder handling for now)
      const dashRes = await fetch(`${BASE_URL}/v1/dashboard/seller`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const dashJson = await dashRes.json();

      if (dashJson.success) {
        if (typeof dashJson.data === 'object') {
          // When backend is updated to send real stats
          setDashboardStats(dashJson.data);
        } else {
          console.warn('Dashboard data is placeholder string:', dashJson.data);
        }
      } else {
        console.error('Failed to fetch dashboard stats:', dashJson.message);
      }
      await getFcmToken();

    } catch (error) {
      console.error('Error fetching dashboard info:', error);
    }
  };

  fetchDashboardData();
}, []);


  if (!user) return <div>Loading...</div>;

  const getProductImage = (product) => {
    if (product.thumbnail?.startsWith('http')) {
      return product.thumbnail;
    }
    if (product.thumbnail) {
      return `https://demo.jadesdev.com.ng${product.thumbnail}`;
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0];
      return img.startsWith('http') ? img : `https://demo.jadesdev.com.ng${img}`;
    }
    return '/default-placeholder.jpg';
  };

  const handleEditProduct = (product) => {
    navigate(`/edit_item/${product.id}`, { state: { product } });
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleToggleStatus = (product) => {
    if (product.status !== 'sold') {
      if (window.confirm('Mark this item as sold?')) {
        markAsSold(product.id);
      }
    }
  };


  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Link to="/seller_profile_settings">
            <div className="profile-container">
              <img
                src={user.image || pp}
                alt="profile"
                className="profile-pic"
                style={{ width: '60px', height: '60px' }}
              />
              <span className="status-indicator1"></span>
            </div>
          </Link>
          <div className="navt">
            <h3>Hello, {user.first_name || 'Seller'} 👋</h3>
            <p className="part">What would you like to do today? Click Explore Profile</p>
          </div>
        </div>

        <div className="header-right">
        <Link to="/seller_notifications" className="icon-wrapper">
  <IoNotifications className="icon" size={24}/>
  <span
    className="status-indicator"
    style={{
      backgroundColor: unreadCount > 0 ? 'red' : 'green',
    }}
  >
    {unreadCount > 0 ? unreadCount : ''}
  </span>
</Link>

        
          
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon-wrapper listings-icon">
            <img src={tl} alt="Total Listings" />
          </div>
          <h4>Total Listings</h4>
          <p>{myProducts.length}</p>
        </div>
        <div className="card">
          <div className="card-icon-wrapper sales-icon">
            <img src={ts} alt="Total Sales" />
          </div>
          <h4>Total Sales</h4>
          {!dashboardStats && <p>Dashboard stats coming soon...</p>}

        </div>
      </div>

      {/* Listed Items */}
      <div className="list-items-section">
        <div className="list-items-left">
          <h4>Listed Items</h4>
        </div>
        <div className="list-items-right">
          <Link to="/items_list">
            <span className="view-all">View All</span>
          </Link>
        </div>
      </div>

      {/* Product Cards */}
      <div className="item-cards">
        {myProducts.map((item) => (
          <div className="item-card" key={item.id}>
            <img src={getProductImage(item)} alt={item.title} className="item-image" />
            <div className="item-info">
             <span
                className={`status ${item.status?.toLowerCase() || 'active'}`}
                onClick={() => handleToggleStatus(item)}
                style={{ cursor: item.status === 'sold' ? 'default' : 'pointer' }}
              >
                {item.status === 'sold' ? 'Sold' : 'Active'}
              </span>
              <span
                className="more-options"
                onClick={() => handleEditProduct(item)}
                style={{ cursor: 'pointer' }}
                title="Edit product"
              >
                •••
              </span>
              <FaTrash
                onClick={() => handleDelete(item.id)}
                title="Delete product"
                style={{ cursor: 'pointer', color: 'red', marginLeft: 10 }}
              />
            </div>
            <p>{item.title}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <Link to="/add_items">
        <div className="plus-icon-wrapper">
          <FiPlus className="plus-icon" />
          <div className="horizontal-lines"></div>
        </div>
      </Link>

      {/* Bottom Nav */}
      <nav className="bottom-nav2">
        <Link to="/seller_dashboard">
          <button className="nav-button2">
            <FaHome className="nav-icon2" />
            <span>Home</span>
          </button>
        </Link>
        <Link to="/items_list">
          <button className="nav-button2">
            <FaClipboardList className="nav-icon2" />
            <span>Listings</span>
          </button>
        </Link>
        <Link to="/buyers_chat">
          <button className="nav-button2">
            <FaComment className="nav-icon2" />
            <span>Messages</span>
          </button>
        </Link>
        <Link to="/seller_orders">
        <button className="nav-button">
        <FaBoxOpen  className="nav-icon" />
        <span className="nav-label">Buyer Orders</span>
        </button></Link>
        <Link to="/seller_profile_settings">
          <button className="nav-button2">
            <AiOutlineUser className="nav-icon2" />
            <span>Profile</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default SellerDashboard;
