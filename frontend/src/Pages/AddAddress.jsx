import React , { useState } from 'react';
import './CSS/AddAddress.css';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import loca from '../Components/Assets/loca.PNG';


const AddAddress = () => {

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  
  return (
    <div className="cart-container5">
                    {/* Header */}
                                   <div className="header2">
                                   <Link to="/address_management">
                                         <FaArrowLeft className="back-icon2" />
                                       </Link>
                                       <h2 className="header-title3">Add Address</h2>
                                   </div>
                            <br></br>
                                   <div className="chat-ap">
                                  <p className="par">Input Your Preferred Address Down Below</p>
                                  <br></br>
                  <form>
                  <div className="input-group">
            <input
              type="text"
              id="text"
              placeholder="Enter your location"
              required
            />
          </div>
          <br></br>                     
          <Link style={{ width:'100%', textDecoration:'None' }} to='/address_adding'>
          <button type="submit"  onClick={handleSubmit} className="make-payment-button">Save Address</button></Link>

          {showPopup && (
                  <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                    <img src={loca} alt="odel" className="" />
                      
                      <h3 className="popup-title">Changing Location</h3>
                      <p className="popup-message">
                        Please be aware that changing your location will remove any items from your cart.
                      </p>
                      <button className="popup-done-button1" onClick={closePopup}>
                        I Understand
                      </button>
                    </div>
                  </div>
                )}
                                      
                                     </form>
                 </div>
                 </div>
  )
}

export default AddAddress
