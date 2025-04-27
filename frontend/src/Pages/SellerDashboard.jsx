import React from 'react';
import './CSS/SellerDashboard.css';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment  } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import pp from '../Components/Assets/pp.jpg'
import { IoNotifications } from "react-icons/io5"; // Notification icon
// Importing product images
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";
import product_34 from "../Components/Assets/product_34.png";
import tl from "../Components/Assets/tl.PNG";
import ts from "../Components/Assets/ts.PNG";





const SellerDashboard = () => {
  const listedItems = [
    { id: 1, image: product_11, status: "Active", name: "Product 11", price: "$120" },
    { id: 2, image: product_12, status: "Sold", name: "Product 12", price: "$150" },
    { id: 3, image: product_13, status: "Active", name: "Product 13", price: "$80" },
    { id: 4, image: product_14, status: "Sold", name: "Product 14", price: "$200" },
    { id: 5, image: product_15, status: "Active", name: "Product 15", price: "$100" },
    { id: 6, image: product_34, status: "Sold", name: "Product 34", price: "$250" },
  ];

  // Array of images
const productImages = [
  product_11,
  product_12,
  product_13,
  product_14,
  product_15,
  product_34,
];


  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
        <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
        <div className="profile-container">  
      <img src={pp} alt="" style={{ width: '60px', height: '60px' }} className="profile-pic" />
      <span className="status-indicator1"></span>
        </div></Link>
              <div className='navt'>
          <h3>Hello, Alex</h3>
          <p className="part">What would you like to do today? Click Explore Profile </p>
          </div>
          </div>
        <div className="header-right">
               
         {/* Notification Bell with Indicator */}
         <Link to="/seller_notifications" style={{ textDecoration: "none" }}>
        <div className="icon-wrapper">
          <IoNotifications className="icon" /> 
          <span className="status-indicator11"></span>
        </div></Link>

        </div>
      </header>
      
      {/* Total Listings & Total Sales Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon-wrapper listings-icon">
          <img src={tl} alt="odel" className="" />
          </div>
          <h4>Total Listings</h4>
          <p>25</p>
        </div>
        <div className="card">
          <div className="card-icon-wrapper sales-icon">
          <img src={ts} alt="odel" className="" />
          </div>
          <h4>Total Sales</h4>
          <p>100</p>
        </div>
      </div>
      
      {/* List Items Section */}
  <div className="list-items-section">
    <div className="list-items-left">
      <h4>Listed Items</h4>
    </div>
    <div className="list-items-right">
      <Link to="/items_list" style={{ textDecoration: "none" }}>
        <span className="view-all">View All</span>
      </Link>
    </div>
  </div>
        
      <div className="item-cards">
  {listedItems.map((item, index) => (
    <div className="item-card" key={item.id}>
      <img
        src={productImages[index % productImages.length]} // Dynamically assign images
        alt="Product"
        className="item-image"
      />
      <div className="item-info">
        <span className={`status ${item.status.toLowerCase()}`}>
          {item.status}
        </span>
        <span className="more-options">•••</span>
      </div>
      <p>{item.name}</p>
      <p>{item.price}</p>
    </div>
  ))}
</div>

       {/* Plus Icon */}
       <Link to="/add_items" style={{ textDecoration: "none" }}>
       <div className="plus-icon-wrapper">
       <FiPlus className="plus-icon" />
       <div className="horizontal-lines"></div>
      </div></Link> 
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
        <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <AiOutlineUser className="nav-icon2" />
            <span className="nav-label2">Profile</span>
          </button>
        </Link>
      </nav>
    </div>
  )
}

export default SellerDashboard

