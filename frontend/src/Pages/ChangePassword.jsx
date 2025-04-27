import React from 'react';
import './CSS/ChangePassword.css';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaEyeSlash  } from 'react-icons/fa';


const ChangePassword = () => {
  return (
    
          <div className="cart-container5">
             {/* Header */}
                            <div className="header2">
                            <Link to="/settings">
                                  <FaArrowLeft className="back-icon2" />
                                </Link>
                                <h2 className="header-title3">Change Password</h2>
                            </div>
                     
                            <div className="chat-ap">
                            <h2 className="welcome-message">Create New Password</h2>
                           <p className="par">Your new password must be different from previous used passwords</p>
            <form>
            <div className="input-group">
                       <label htmlFor="password">Current Password</label>
                       <div className="password-container">
                         <input
                           type="password"
                           id="password"
                           placeholder="Enter password"
                           required
                         />
                         <button type="button" className="show-password">
                           <FaEyeSlash />
                         </button>
                       </div>
                     </div>
                     <div className="input-group">
                       <label htmlFor="password">New Password</label>
                       <div className="password-container">
                         <input
                           type="password"
                           id="password"
                           placeholder="Enter password"
                           required
                         />
                         <button type="button" className="show-password">
                           <FaEyeSlash />
                         </button>
                       </div>
                     </div>
                     <div className="input-group">
                       <label htmlFor="password">Confirm Password</label>
                       <div className="password-container">
                         <input
                           type="password"
                           id="password"
                           placeholder="Enter password"
                           required
                         />
                         <button type="button" className="show-password">
                           <FaEyeSlash />
                         </button>
                       </div>
                     </div>
                     <Link style={{ width:'100%', textDecoration:'None' }} to=''><button type="submit" className="make-payment-button">Change Password</button></Link>
                    
                   </form>
          </div>
          </div>
        
  )
}

export default ChangePassword
