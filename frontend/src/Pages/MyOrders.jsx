// src/pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import './CSS/MyOrders.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaArrowLeft,
  FaHome,
  FaShoppingCart,
  FaClipboardList,
  FaCog
} from 'react-icons/fa';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOrderRemarks = () => {
    navigate('/payment_order');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await getAccessToken();
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/v1/orders`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.success) {
          setOrders(result.data || []);
        } else {
          console.error("Failed to fetch orders:", result.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.items?.some(item => (item.buyer_status || '').toLowerCase() === activeTab.toLowerCase())
  );

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="header2">
        <Link to="/home">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">
          My Orders
          <button
            style={{
              padding: "12px 16px",
              color: "#fff",
              borderRadius: "10px",
              backgroundColor: "#280769",
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "0.8rem"
            }}
            onClick={handleOrderRemarks}
          >
            View Order Remarks
          </button>
        </h2>
        <Link to="/notifications">
          <div className="icon-wrapper">
            <FaBell className="icon1" />
            <span className="status-indicator2"></span>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["pending", "processing", "completed", "rejected"].map((status) => (
          <button
            key={status}
            className={`tab-button ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No {activeTab} orders found.</p>
        ) : (
          filteredOrders.map((order) => {
            const quantity = order.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
            const total = parseFloat(order.total || order.price || '0');

            return (
              <div className="order-card" key={order.id}>
                <div className="row">
                  <p className="left">Order #{order.code || order.order_id || order.id}</p>
                  <p className="righttra">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>

                <div className="row">
                  <p className="lefttra">
                    Quantity: <strong style={{ color: "black" }}>{quantity}</strong>
                  </p>
                  <p className="righttra">
                    Total:{" "}
                    <strong style={{ color: "black", fontSize: "20px" }}>
                      ₦{total.toFixed(2)}
                    </strong>
                  </p>
                </div>

                {/* Item-level status row */}
                <div className="row">
                  <p className="status-label">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className={`status-tag ${item.buyer_status || item.status}`}>
                        {item.name}: {item.buyer_status || item.status}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="row">
                  <p className={`status ${activeTab}`}>{activeTab}</p>
                  <Link to={`/order_delivered?id=${order.id}`} style={{ width: "22%", textDecoration: "none" }}>
                    <button type="submit" className="details-button">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/home"><button className="nav-button"><FaHome className="nav-icon" /><span className="nav-label">Home</span></button></Link>
        <Link to="/cart_items"><button className="nav-button"><FaShoppingCart className="nav-icon" /><span className="nav-label">Cart</span></button></Link>
        <Link to="/orders_product"><button className="nav-button"><FaClipboardList className="nav-icon" /><span className="nav-label">Orders</span></button></Link>
        <Link to="/settings"><button className="nav-button"><FaCog className="nav-icon" /><span className="nav-label">Settings</span></button></Link>
      </nav>
    </div>
  );
};

export default MyOrders;
