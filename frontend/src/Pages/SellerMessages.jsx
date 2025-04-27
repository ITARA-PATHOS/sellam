import React, { useState } from 'react';
import './CSS/SellerMessages.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaArrowLeft, FaShoppingCart, FaCog,} from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md'; // Import for the tick mark
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";
import product_34 from "../Components/Assets/product_34.png";

const SellerMessages = () => {
    const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app">
                  {/* Header Section */}
                          <div className="header4" style={{ background: "#ffffff" }}>
                            <Link to="/product_details">
                              <FaArrowLeft className="back-icon5" />
                            </Link>
                            <h2 className="header-title3">Chat</h2>
                            
                          </div>
                  
                  <div className='chat-ap' >
                  <div className="search-bar5">
          <AiOutlineSearch className="search-icon5" />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="chat-list">
          {/* Chat 1 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_11} alt="Product 1" />
              <div className="chat-info">
                <div className="chat-name">Adam</div>
                <div className="chat-last-message">Hi</div>
              </div>
              <div className="chat-meta">
                <span className="chat-date">Mon</span>
                <span className="unread-count">2</span> 
              </div>
            </div>
          </Link>

          {/* Chat 2 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_12} alt="Product 2" />
              <div className="chat-info">
                <div className="chat-name">Chloe Scarlett</div>
                <div className="chat-last-message">Thanks <MdCheckCircle className="tick-mark" /></div> 
              </div>
              <div className="chat-meta">
                <span className="chat-date">Sun</span>
              </div>
            </div>
          </Link>

          {/* Chat 3 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_13} alt="Product 3" />
              <div className="chat-info">
                <div className="chat-name">Melissa</div>
                <div className="chat-last-message">Welcome!!!</div>
              </div>
              <div className="chat-meta">
                <span className="chat-date">Sun</span>
              </div>
            </div>
          </Link>

          {/* Chat 4 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_14} alt="Product 4" />
              <div className="chat-info">
                <div className="chat-name">Evelyn</div>
                <div className="chat-last-message">Good Morning <MdCheckCircle className="tick-mark" /></div> 
              </div>
              <div className="chat-meta">
                <span className="chat-date">Fri</span>
                <span className="unread-count">5</span> 
              </div>
            </div>
          </Link>

          {/* Chat 5 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_15} alt="Product 5" />
              <div className="chat-info">
                <div className="chat-name">Ella</div>
                <div className="chat-last-message">Can I check it?</div>
              </div>
              <div className="chat-meta">
                <span className="chat-date">Thur</span>
              </div>
            </div>
          </Link>

          {/* Chat 6 */}
          <Link to="/chat_seller" style={{ textDecoration: "none" }}> 
            <div className="chat-item">
              <img src={product_34} alt="Product 6" />
              <div className="chat-info">
                <div className="chat-name">James Charlie</div>
                <div className="chat-last-message">Perfect, I will check on it...</div>
              </div>
              <div className="chat-meta">
                <span className="chat-date">Tue</span>
              </div>
            </div>
          </Link>
        </div>
    
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
}

export default SellerMessages
