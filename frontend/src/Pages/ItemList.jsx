import React, { useState } from 'react';
import './CSS/ItemList.css';
import { FaArrowLeft, FaComment } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FiFilter } from "react-icons/fi";
import { AiOutlineUser } from 'react-icons/ai';
import { FaClipboardList, FaHome } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import step from '../Components/Assets/step.PNG'

// Importing product images
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";
import product_34 from "../Components/Assets/product_34.png";




const ItemList = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  
    const handleSubmit = () => {
      setShowPopup(true);
    };

    const handleSubmit1 = () => {
        setShowPopup1(true);
      };
  
    const closePopup = () => {
      setShowPopup(false);
    };
    
    const closePopup1 = () => {
        setShowPopup1(false);
      };
  
  const listedItems = [
      { id: 1, image: product_11, status: "Active", name: "Product 11", price: "$120", category: "Fashion" },
      { id: 2, image: product_12, status: "Sold", name: "Product 12", price: "$150", category: "Tech" },
      { id: 3, image: product_13, status: "Active", name: "Product 13", price: "$80", category: "Food" },
      { id: 4, image: product_14, status: "Sold", name: "Product 14", price: "$200", category: "Tech" },
      { id: 5, image: product_15, status: "Active", name: "Product 15", price: "$100", category: "Food" },
      { id: 6, image: product_34, status: "Sold", name: "Product 34", price: "$250", category: "Fashion" },
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
          {/* Header Section */}
                  <div className="header2">
                    <Link to="/seller_dashboard">
                      <FaArrowLeft className="back-icon2" />
                    </Link>
                    <h2 className="header-title2">Listings</h2>
                    <div className="header-icons5">
                    <Link style={{ textDecoration:'None' }} to='/items_list'>
                      <FiFilter className="header-icon5 attachment-icon" onClick={handleSubmit} /></Link>
                      <img src={step} alt="odel" onClick={handleSubmit1} className="" style={{ cursor: "pointer" }}/>
                      </div>
                  </div>
          
          
                  
                  
          <div className="item-cards">
      {listedItems.map((item, index) => (
        <Link to="/manage_items_list" style={{ textDecoration: "none", color: "#333" }}>
        <div className="item-card" key={item.id}>
        <div className="item-container">
        <div className='ih'>
          <span className={`status ${item.status.toLowerCase()}`}>
              {item.status}
            </span></div>
          <img
            src={productImages[index % productImages.length]} // Dynamically assign images
            alt="Product"
            className="item-image1"
          />
          </div>

          <div className="item-info">
          <p>{item.name}</p>
            <span className="more-options">•••</span>
          </div>
          <p>Category: {item.category}</p>
          <p>{item.price}</p>
        </div></Link>
      ))}
    </div>
           
           {showPopup && (
                             <div className="popup-overlay1" onClick={closePopup}>
                               <div className="popup-box1" onClick={(e) => e.stopPropagation()}>
                              

                                 <h3 className="popup-title1">Filter</h3>
                                 <br/>
                                 <p className="popup-message1">Active
                                 </p>
                                 <p className="popup-message1">Sold
                                 </p>
                                 <p className="popup-message1">Date Listed
                                 </p>
                                 <p className="popup-message1">Price Range
                                 </p>
                                 <br/>
                                 <br/>

                               </div>
                             </div>
                           )}

                           {showPopup1 && (
                             <div className="popup-overlay1" onClick={closePopup1}>
                               <div className="popup-box1" onClick={(e) => e.stopPropagation()}>
                              

                                 <h3 className="popup-title1">Sort</h3>
                                 <br/>
                                 <p className="popup-message1">Newest
                                 </p>
                                 <p className="popup-message1">Oldest
                                 </p>
                                 <p className="popup-message1">Higher Price
                                 </p>
                                 <p className="popup-message1">Lowest Price
                                 </p>
                                 <br/>
                                 <br/>

                               </div>
                             </div>
                           )}
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

export default ItemList
