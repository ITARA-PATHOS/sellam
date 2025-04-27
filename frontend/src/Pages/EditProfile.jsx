import React, { useState } from 'react';
import './CSS/EditProfile.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaCamera  } from 'react-icons/fa';
import pp from '../Components/Assets/pp.jpg'
import { AiFillFlag } from "react-icons/ai";


const EditProfile = () => {

  const genders = ["Male", "Female" ];
  const [currentGender, setCurrentGender] = useState("Male");
  const [showDropdown, setShowDropdown] = useState(false);
  

  return (
    <div className="cart-container5">
                 {/* Header */}
                                <div className="header2">
                                <Link to="/account_settings">
                                      <FaArrowLeft className="back-icon2" />
                                    </Link>
                                    <h2 className="header-title3">Edit Profile</h2>
                                </div>
                                <br></br>
                                <div className="chat-ap">

                                <div className="pc">  
                                <div className="profile-pic-container" style={{ position: "relative" }}>
            <img
              src={pp}
              alt=""
              style={{ width: "100px", height: "100px" }}
              className="profile-pic"
            />
            {/* Camera and Plus Icon */}
            <div
              className="camera-icon"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#280769",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <FaCamera style={{ color: "#fff", fontSize: "25px", zIndex: "1" }} />
            </div>
          </div>
          <h2 className="header-title3">Alex Wilson</h2>
          </div>
                      <br></br>  
                      <br></br> 
                      <br></br>  

                <form>
                <div className="input-group">
            <label htmlFor="text">Enter First Name</label>
            <input
              type="text"
              id="text"
              placeholder="Alex"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="text">Enter Last Name</label>
            <input
              type="text"
              id="text"
              placeholder="Wilson"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="alexwilson@gmail.com"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="text">Phone Number</label>
            <div className="phone-input" style={{ display: "flex", alignItems: "center" }}>
              {/* Nigerian Flag Icon */}
              <span style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
                <AiFillFlag style={{ color: "#008753", fontSize: "20px" }} />
              </span>
              <input
                type="text"
                id="phone"
                placeholder="+234 8032645345"
                style={{ flex: 1 }}
                required
              />
            </div>
          </div>
          
          <div
            className="input-group"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <label htmlFor="gender">Gender</label>
            <input
              type="text"
              id="gender"
              placeholder={currentGender}
              value={currentGender}
              readOnly
              required
            />
            <FaChevronDown style={{ position: "absolute", right: "10px", top: "40px" }} />
          </div>
          {showDropdown && (
            <ul className="dropdown-options1">
              {genders.map((gender) => (
                <li
                  key={gender}
                  className="dropdown-option1"
                  onClick={() => {
                    setCurrentGender(gender);
                    setShowDropdown(false); // Close dropdown after selection
                  }}
                >
                  {gender}
                </li>
              ))}
            </ul>
          )}<br></br>

                         <Link style={{ width:'100%', textDecoration:'None' }} to=''><button type="submit" className="make-payment-button">Save</button></Link>
                        
                       </form>
              </div>
              </div>
  )
}

export default EditProfile
