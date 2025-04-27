import React from 'react';
import './CSS/Support.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import chat from '../Components/Assets/chat.PNG';
import call from '../Components/Assets/call.PNG';
import whatsap from '../Components/Assets/whatsap.PNG';


const Support = () => {
  return (
    <div className="cart-container5">
                    {/* Header */}
                                   <div className="header2">
                                   <Link to="/account_settings">
                                         <FaArrowLeft className="back-icon2" />
                                       </Link>
                                       <h2 className="header-title3">Support</h2>
                                   </div>
                            
                                   <div className="chat-ap">
                                   <h2 className="welcome-message">Let's Support you</h2>
                                  <p className="par">Contact us via phone, email, or WhatsApp chat if you have a complaint,
                                  suggestion, or bug to report. We would sincerely appreciate hearing from you.</p>
                   
                       <div className="support-stat">
                                     <img src={chat} alt="odel" className="ss" />
                                     <img src={whatsap} alt="odel" className="ss" />
                                     <img src={call} alt="odel" className="ss" />
                                   </div>
                 </div>
                 </div>
  )
}

export default Support
