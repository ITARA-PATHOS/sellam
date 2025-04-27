import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { FiSmile, FiMic, FiMoreVertical } from "react-icons/fi";
import product_11 from "../Components/Assets/product_11.png";
import pp from '../Components/Assets/pp.jpg'

import './CSS/ChatBuyer.css';


const ChatBuyer = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [keyboardType, setKeyboardType] = useState("letters");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
      {
        text: "or we could make this?",
        type: "sent",
        image: product_11, // Image for the received message
      },
      { text: "Sounds good!", type: "received" },
      { text: "Let's do it", type: "sent" },
      { text: "Great!", type: "sent" },
    ]);
  
    const toggleKeyboard = () => {
      setIsKeyboardOpen(!isKeyboardOpen);
    };
  
    const switchKeyboard = (type) => {
      setKeyboardType(type);
    };
  
    const handleKeyPress = (char) => {
      setMessage((prev) => prev + char);
    };
  
    const sendMessage = () => {
      if (message.trim() !== "") {
        setMessages((prev) => [...prev, { text: message, type: "sent" }]);
        setMessage("");
      }
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
  
    return (
      <div className="chat-app">
        {/* Header Section */}
        <div className="header2">
          <Link to="/buyers_chat">
            <FaArrowLeft className="back-icon2" />
          </Link>
          <h2 className="header-title2">Richard Williams</h2>
          <div className="header-icons5">
            <AiOutlinePaperClip className="header-icon5 attachment-icon" />
            <FiMoreVertical className="header-icon5 more-icon" />
          </div>
        </div>

        <div className="chat-aps">
 
  
        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === "received" && (
                <img
                  src={pp}
                  alt="Seller"
                  className="seller-image"
                />
              )}
              <div className="message-content">
                {msg.image && <img src={msg.image} alt="Received" className="message-image" />}
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
  
        {/* Input Field */}
        <div className="input-container5">
          <FiSmile className="input-icon5 emoji-icon dark" />
          <input
            type="text"
            placeholder="Type a message"
            onFocus={toggleKeyboard}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input"
          />
          <AiOutlineSend className="input-icon5 send-icon" onClick={sendMessage} />
          <FiMic className="input-icon5 voice-icon" />
        </div>
  
        {/* Dynamic Keyboard */}
        {isKeyboardOpen && <div className="keyboard-container">{renderKeyboard()}</div>}
      </div>
      </div>
    );
  };

export default ChatBuyer
