import React, { useState } from 'react';
import './CSS/ManageListings.css';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaArrowLeft, FaArrowRight  } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
// Importing product images
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";
import product_34 from "../Components/Assets/product_34.png";

const ManageListings = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const listedItems = [
    { id: 1, image: product_11, status: "Active", name: "Product 11", price: "$120", category: "Fashion", numIn: 12, numview: 13 },
    { id: 2, image: product_12, status: "Sold", name: "Product 12", price: "$150", category: "Tech", numIn: 20, numview: 23 },
    { id: 3, image: product_13, status: "Active", name: "Product 13", price: "$80", category: "Food", numIn: 23, numview: 17 },
    { id: 4, image: product_14, status: "Sold", name: "Product 14", price: "$200", category: "Tech", numIn: 25, numview: 32 },
    { id: 5, image: product_15, status: "Active", name: "Product 15", price: "$100", category: "Food", numIn: 15, numview: 30 },
    { id: 6, image: product_34, status: "Sold", name: "Product 34", price: "$250", category: "Fashion", numIn: 19, numview: 20 },
  ];

  const handleNext = () => {
    if (currentIndex < listedItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  const currentItem = listedItems[currentIndex];

    
    
  return (
    <div className="app">
              {/* Header Section */}
                      <div className="header4" style={{ background: "#ffffff" }}>
                        <Link to="/items_list">
                          <FaArrowLeft className="back-icon5" />
                        </Link>
                        <h2 className="header-title3">Manage Listings</h2>
                        
                      </div>
              
              <div className='chat-ap'>

             
                
              {/* Item Card */}
      <div className="item-card1">
        <div className="item-container1">
          <div className="ih1">
            <span className={`status ${currentItem.status.toLowerCase()}`}>
              {currentItem.status}
            </span>
          </div>
          <img
            src={currentItem.image}
            alt="Product"
            className="item-image2"
          />
        </div>
        
        <div className="item-info">
          <p>{currentItem.name}</p>
            <span className="more-options">•••</span>
          </div>
        <div className="item-info">
          <div className="cv">
            <p>Category: {currentItem.category}</p>
            <p>Views: {currentItem.numview} views</p>
          </div>
          <div className="pi">
            <p>Price: {currentItem.price}</p>
            <p>Inquiries: {currentItem.numIn} inquiries</p>
          </div>
        </div>
      </div>

           
           <Link to="/items_list" style={{ textDecoration: "none" }}>
                 <button type="submit" className="submit-btn4">Mark as Sold</button></Link>
               
               {/* Navigation Buttons */}
      <div className="navigation-buttons1">
      <button
          className="nav-btn1 prev-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft className="icon0" />
          <span>Previous</span>
        </button>
        <button
          className="nav-btn1 next-btn"
          onClick={handleNext}
          disabled={currentIndex === listedItems.length - 1}
        >
          <span>Next</span>
          <FaArrowRight className="icon0" />
        </button>
      </div>
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

export default ManageListings
