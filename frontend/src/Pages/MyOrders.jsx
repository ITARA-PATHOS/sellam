import React, { useState } from 'react';
import './CSS/MyOrders.css';
import { Link } from 'react-router-dom';
import {  FaBell, FaArrowLeft,FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';


const MyOrders = () => {
    const [activeTab, setActiveTab] = useState("Pending");

    const orders = [
      { id: 1, trackingNumber: "IK28756838", quantity: 2, subtotal: "$110", status: "Pending", date: "13/05/2021" },
      { id: 2, trackingNumber: "IK28756839", quantity: 1, subtotal: "$55", status: "Pending", date: "14/05/2021" },
      { id: 3, trackingNumber: "IK28756840", quantity: 3, subtotal: "$165", status: "Pending", date: "15/05/2021" },
      { id: 4, trackingNumber: "IK28756841", quantity: 2, subtotal: "$110", status: "Delivered", date: "12/05/2021" },
      { id: 5, trackingNumber: "IK28756842", quantity: 1, subtotal: "$55", status: "Delivered", date: "11/05/2021" },
      { id: 6, trackingNumber: "IK28756843", quantity: 3, subtotal: "$165", status: "Delivered", date: "10/05/2021" },
      { id: 7, trackingNumber: "IK28756844", quantity: 4, subtotal: "$220", status: "Delivered", date: "09/05/2021" },
      { id: 8, trackingNumber: "IK28756845", quantity: 1, subtotal: "$55", status: "Cancelled", date: "08/05/2021" },
      { id: 9, trackingNumber: "IK28756846", quantity: 2, subtotal: "$110", status: "Cancelled", date: "07/05/2021" },
      { id: 10, trackingNumber: "IK28756847", quantity: 3, subtotal: "$165", status: "Cancelled", date: "06/05/2021" },
    ];
  
    const filteredOrders = orders.filter((order) => order.status === activeTab);
  
    return (
      <div className="orders-container">
        {/* Header */}
        <div className="header2">
            <Link to="/home">
              <FaArrowLeft className="back-icon2" />
              </Link>
              <h2 className="header-title2">My Orders</h2>
              <Link to="/notifications">
              <div className="icon-wrapper">
                        <FaBell className="icon1" />
                        <span className="status-indicator2"></span>
                      </div>
              </Link>
            </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </button>
          <button
            className={`tab-button ${activeTab === "Delivered" ? "active" : ""}`}
            onClick={() => setActiveTab("Delivered")}
          >
            Delivered
          </button>
          <button
            className={`tab-button ${activeTab === "Cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("Cancelled")}
          >
            Cancelled
          </button>
        </div>
  
         {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="row">
              <p className="left">Order #{order.id}</p>
              <p className="righttra">{order.date}</p>
            </div>
            <div className="row">
              <p className="lefttra">Tracking number:</p>
              <p className="right">{order.trackingNumber}</p>
            </div>
            <div className="row">
              <p className="lefttra">Quantity: <strong style={{color:'black'}}>{order.quantity}</strong></p>
              <p className="righttra">Subtotal: <strong style={{color:'black', fontSize:'20px'}}>{order.subtotal}</strong></p>
            </div>
            <div className="row">
              <p className={`status ${order.status.toLowerCase()}`}>{order.status}</p>
              <Link style={{ width:'22%', textDecoration: "none" }} to='/order_delivered'>  
              <button type="submit" className="details-button">Details</button>
              </Link>
                          </div>
          </div>
        ))}
      </div>

        {/* Bottom Navigation */}
         <nav className="bottom-nav">
                 <Link to="/home" style={{ textDecoration: "none" }}>
                       <button className="nav-button">
                       <FaHome className="nav-icon" />
                       <span className="nav-label">Home</span>
                             </button></Link>
                             <Link to="/cart_items" style={{ textDecoration: "none" }}>
                       <button className="nav-button">
                       <FaShoppingCart className="nav-icon" />
                       <span className="nav-label">Cart</span>
                             </button></Link>
                   <Link to="/orders_product" style={{ textDecoration: "none" }}>
                                                <button className="nav-button">
                                                <FaClipboardList className="nav-icon" />
                                                <span className="nav-label">Orders</span>
                                                </button></Link>
                                              <Link to="/settings" style={{ textDecoration: "none" }}>
                                                <button className="nav-button">
                                                <FaCog className="nav-icon" />
                                                <span className="nav-label">Settings</span>
                                                </button></Link>
                </nav>
      </div>
    );
};

export default MyOrders
