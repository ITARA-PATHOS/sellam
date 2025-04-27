import React, { useState } from 'react';
import './CSS/SearchPage.css';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiTrash2, FiX } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";
import filter from "../Components/Assets/filter.PNG";



const SearchPage = () => {

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardType, setKeyboardType] = useState("letters");
  const [message, setMessage] = useState("");

  const toggleKeyboard = () => {
    setIsKeyboardOpen(!isKeyboardOpen);
  };

  const handleKeyPress = (char) => {
    setMessage((prev) => prev + char);
  };

  const switchKeyboard = (type) => {
    setKeyboardType(type);
  };

  const renderKeyboard = () => {
    if (keyboardType === "letters") {
      return (
        <div className="keyboard">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
            <button key={letter} className="key-btn" onClick={() => handleKeyPress(letter)}>
              {letter}
            </button>
          ))}
          <button className="key-btn cancel-btn" onClick={toggleKeyboard}>
            Cancel
          </button>
          <button className="key-btn switch-btn" onClick={() => switchKeyboard("numbers")}>
            123
          </button>
        </div>
      );
    } else if (keyboardType === "numbers") {
      return (
        <div className="keyboard">
          {Array.from("0123456789!@#$%^&*()").map((char) => (
            <button key={char} className="key-btn" onClick={() => handleKeyPress(char)}>
              {char}
            </button>
          ))}
          <button className="key-btn cancel-btn" onClick={toggleKeyboard}>
            Cancel
          </button>
          <button className="key-btn switch-btn" onClick={() => switchKeyboard("letters")}>
            ABC
          </button>
        </div>
      );
    }
  };

  const sendMessage = () => {
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <div className="recent-searches-container">
      {/* Header */}
      <div className="header2">
      <Link to="/home">
            <FaArrowLeft className="back-icon2" />
          </Link>
      </div>
    
      <div className="chat-ap">

      {/* Input Field */}
      <div className="input-container5">
        <input
          type="text"
          placeholder="Search for items"
          onFocus={toggleKeyboard}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <AiOutlineSend className="input-icon5 send-icon" onClick={sendMessage} />
      </div>
      {/* Filter Icon */}
      <div className="filter-icon-container"> 
       <img src={filter} alt="Men Genuine Leather Bag" className="product-image3" />
      </div>

      {/* Dynamic Keyboard */}
      {isKeyboardOpen && <div className="keyboard-container">{renderKeyboard()}</div>}

      {/* Recent Searches Header */}
      <div className="recent-header">
        <p className="recent-title">Recent Searches</p>
        <FiTrash2 className="clear-icon1" />
      </div>

      {/* Recent Searches Tags */}
      <div className="recent-searches-tags">
        {["Sunglasses", "Sweater", "Hoodie", "Jacket"].map((tag, index) => (
          <div key={index} className="tag">
            <span className="tag-text">{tag}</span>
            <FiX className="tag-close-icon" />
          </div>
        ))}
      </div>
      </div>
      </div>


  )
}

export default SearchPage
