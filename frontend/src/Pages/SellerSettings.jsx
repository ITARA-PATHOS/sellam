import React from 'react';
import './CSS/SellerSettings.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import upro from '../Components/Assets/upro.PNG'
import pp from '../Components/Assets/pp.jpg'
import { MdLock } from 'react-icons/md'; // Material Design Icons
import logot from '../Components/Assets/logot.PNG';





const SellerSettings = () => {
  return (
    <div className="cart-container5">
                    {/* Header */}
                                   <div className="header2">
                                   <Link to="/seller_dashboard">
                                         <FaArrowLeft className="back-icon2" />
                                       </Link>
                                       <h2 className="header-title3">Settings</h2>
                                   </div>
                                 
                                 <br></br>
                                   <div className="chat-ap">
                                   <div className="header-left">
                                   <img src={pp} alt="" style={{ width: '80px', height: '80px' }} className="profile-pic" />
                                                 <div className='navt'>
                                                 <h2 className="welcome-message1">Lucy Williams</h2>
                                                 <p className="par1">#seller</p>
                                             </div>
                                             </div>
                                   
                                             <br></br>
                                             <hr></hr>
                        <Link to="/seller_password_changing" style={{ textDecoration: "none" }}>
                       <div className="order-status-card4">
                                         <div className="status-content">
                                           <div className="status-text-group1">
                                           <MdLock className="gift-icon2" style={{ color: "#333" }}/> {/* Gift icon added */}
                                           <p className="rate-title">Change Password</p>
                                           </div>
                                         </div>
                                       </div></Link>
                                       <Link to="/edit_seller_profile" style={{ textDecoration: "none" }}>
                       <div className="order-status-card4">
                                         <div className="status-content">
                                           <div className="status-text-group1">
                                           <img src={upro} alt="odel" className="" style={{ width: '40px', height: '50px' }}/>
                                           <p className="rate-title">Update Profile</p>
                                           </div>
                                         </div>
                                       </div></Link>
                                       <Link to="/" style={{ textDecoration: "none" }}>
                       <div className="order-status-card4">
                                         <div className="status-content">
                                           <div className="status-text-group1">
                    <img src={logot} alt="odel" className="" />
                                           <p className="rate-title">Log out</p>
                                           </div>
                                         </div>
                                       </div></Link>
                 </div>
                 </div>
  )
}

export default SellerSettings
