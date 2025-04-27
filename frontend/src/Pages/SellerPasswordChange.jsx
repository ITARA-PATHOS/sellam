import React from 'react';
import './CSS/SellerPasswordChange.css';
import { AiOutlineUser } from 'react-icons/ai';
import locka from '../Components/Assets/locka.PNG';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaArrowLeft } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";

const SellerPasswordChange = () => {
  return (
    <div className="app">
                          {/* Header Section */}
                                  <div className="header4" style={{ background: "#ffffff" }}>
                                    <Link to="/seller_profile_settings">
                                      <FaArrowLeft className="back-icon5" />
                                    </Link>
                                    <h2 className="header-title3">Change Password</h2>
                                    
                                  </div>
                          
                          <div className='chat-ap' >
                          <div className="pc">  
                                                          <div className="profile-pic-container" style={{ position: "relative" }}>
                                      <img
                                        src={locka}
                                        alt=""
                                        style={{ width: "250px", height: "250px"}}
                                        className="profile-pic"
                                      />
                                      
                                    </div>
                                    <h3 className="header-title3" style={{ color: "#555"}}>
                                    Your New Password Must be Different from Previously Used Password
                                    </h3>
                                    </div>
                         
    
                          <form style={{ padding: "30px"}}>
                                          <div className="input-group">
                                      <label htmlFor="text" style={{ color: "#333" }}>New Password</label>
                                      <input
                                        type="text"
                                        id="password"
                                        placeholder="Lucy@1234432134568"
                                        required
                                        style={{ border: "none" }}
                                      />
                                    </div>
                                    <div className="input-group">
                                      <label htmlFor="text" style={{ color: "#333" }}>Confirm Password</label>
                                      <input
                                        type="password"
                                        id="password"
                                        placeholder="********************"
                                        required 
                                        style={{ border: "none" }}
                                      />
                                    </div>
                                    
                                   
                                                   <Link style={{ width:'100%', textDecoration:'None' }} to=''><button type="submit" className="make-payment-button">Save</button></Link>
                                                  <br/>
                                                  <br/>
                                                  <br/>
                                                  <br/>
                                                 </form>
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

export default SellerPasswordChange
