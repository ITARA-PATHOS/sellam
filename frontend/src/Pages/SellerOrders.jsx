import React, { useState, useEffect } from 'react';
import './CSS/MyOrders.css';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import {
  FaArrowLeft,
  FaHome,
  FaClipboardList,
  FaComment,
  FaBoxOpen
} from 'react-icons/fa';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SellerOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch ALL seller orders with explicit query for robustness
  useEffect(() => {
  const fetchSellerOrders = async () => {
    const token = await getAccessToken();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/v1/orders/seller?per_page=100`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      console.log("📦 Raw seller orders result:", result); // ✅ LOG IT

      if (result.success) {
        if (!result.data || result.data.length === 0) {
          console.warn("✅ Success, but no orders found. Check if the product is marked as sold.");
        }
        setOrders(result.data || []);
      } else {
        console.error("Failed to fetch seller orders:", result.message);
      }
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSellerOrders();
  
}, []);

  // ✅ Filter dynamically by `seller_status`
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          return (order.seller_status || '').toLowerCase() === activeTab.toLowerCase();
        });

  // ✅ Function to update both seller and buyer order status
 const updateOrderStatus = async (orderItemId, newStatus, feedback = null) => {
  const token = await getAccessToken();

  try {
    // ✅ Seller update
    const res1 = await fetch(`${BASE_URL}/v1/orders/seller/${orderItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: newStatus,
        feedback: feedback || null // optional
      })
    });

    if (!res1.ok) throw new Error("Failed to update seller status");

    // ✅ Buyer update only if status is valid for buyer
    if (["completed", "rejected"].includes(newStatus)) {
      const res2 = await fetch(`${BASE_URL}/v1/orders/buyer/${orderItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          feedback: feedback || null
        })
      });

       const data2 = await res2.json();
       console.log("Buyer status update response:", data2); // 👈 log it

      if (!res2.ok) throw new Error("Failed to update buyer status");
    }

    // ✅ Update UI immediately
    setOrders(prev =>
      prev.map(order =>
        order.id === orderItemId
          ? { ...order, seller_status: newStatus }
          : order
      )
    );

  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update order status.");
  }
};



  return (
    <div className="orders-container">
      {/* Header */}
      <div className="header2">
        <Link to="/seller_dashboard">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">Orders from Buyers</h2>
      </div>

      {/* Status Tabs */}
<div className="tabs">
  {["all", "pending", "processing", "completed", "rejected"].map((status) => (
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
    <p style={{ textAlign: 'center' }}>
      No {activeTab !== "all" ? activeTab : ""} orders found.
    </p>
  ) : (
    filteredOrders.map((order) => {
      const product = order.product || {};
      const buyer = order.buyer || {};
      const quantity = order.quantity || 1;
      const total = parseFloat(order.total || order.price || '0');

      return (
        <div className="order-card" key={order.id}>
          <div className="row">
            <p className="left">Order #{order.code || order.order_id || order.id}</p>
            <p className="righttra">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : '—'}
            </p>
          </div>

          <div className="row">
            <p className="lefttra">Product:</p>
            <p className="right">{product.title || '—'}</p>
          </div>

          <div className="row">
            <p className="lefttra">Buyer:</p>
            <p className="right">{buyer.full_name || buyer.username || '—'}</p>
          </div>

          <div className="row">
            <p className="lefttra">Quantity:</p>
            <p className="right">{quantity}</p>
          </div>

          <div className="row">
            <p className="lefttra">Total:</p>
            <p className="right">₦{total.toFixed(2)}</p>
          </div>

          <div className="row">
            <p className={`status ${activeTab}`}>
              {order.seller_status || '—'}
            </p>
          </div>

          {/* Status Update Buttons */}
          <div className="row">
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => updateOrderStatus(order.id, 'processing')}
                style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Mark as Processing
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Mark as Completed
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'rejected')}
                style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>


      {/* Bottom Navigation */}
      <nav className="bottom-nav2">
        <Link to="/seller_dashboard" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <FaHome className="nav-icon2" />
            <span className="nav-label2">Home</span>
          </button>
        </Link>
        <Link to="/items_list" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <FaClipboardList className="nav-icon2" />
            <span className="nav-label2">Listings</span>
          </button>
        </Link>
        <Link to="/buyers_chat" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <FaComment className="nav-icon2" />
            <span className="nav-label2">Messages</span>
          </button>
        </Link>
        <Link to="/seller_orders">
          <button className="nav-button">
            <FaBoxOpen className="nav-icon" />
            <span className="nav-label">Buyer Orders</span>
          </button>
        </Link>
        <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <AiOutlineUser className="nav-icon2" />
            <span className="nav-label2">Profile</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default SellerOrders;
