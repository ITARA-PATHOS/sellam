import React from 'react';
import './CSS/AccountSettings.css';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaCog, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import tos from '../Components/Assets/tos.PNG';
import logot from '../Components/Assets/logot.PNG';
import support from '../Components/Assets/support.PNG';



const AccountSettings = () => {
  return (
    <div className="cart-container6">
          {/* Header */}
                <div className="header2">
                <Link to="/home">
                      <FaArrowLeft className="back-icon2" />
                    </Link>
                    <h2 className="header-title3">Account Settings</h2>
                </div>
         
                <div className="chat-ap">

            <div className="order-status-card3">
                
                  <div className="status-text-group">
                    <p className="status-text">Hello, Alex !</p>
                    <p className="status-subtext">What would you like to do today?</p>
                  </div>
                
              </div>
         
         {/* Settings Cards */}
          <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <AiOutlineUser className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">My Profile</p>
                    </div>
                    <Link to="/edit_profile">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <FaClipboardList className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">My Orders</p>
                    </div>
                    <Link to="/orders_product">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <br></br>

                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <img src={support} alt="odel" className="" />
                    <p className="rate-title">Support</p>
                    </div>
                    <Link to="/buyer_support">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <FaCog className="gift-icon2" /> {/* Gift icon added */}
                    <p className="rate-title">Settings</p>
                    </div>
                    <Link to="/settings">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <img src={tos} alt="odel" className="" />
                    <p className="rate-title">Terms Of Service</p>
                    </div>
                    <Link to="">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>
                <br></br>

                <div className="order-status-card1">
                  <div className="status-content">
                    <div className="status-text-group1">
                    <img src={logot} alt="odel" className="" />
                    <p className="rate-title">Logout</p>
                    </div>
                    <Link to="/">
                    <FaArrowRight className="back-icon5" /></Link>
                  </div>
                </div>

          
        </div>
        </div>
  )
}

export default AccountSettings
