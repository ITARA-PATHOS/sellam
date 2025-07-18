import React, { useState } from 'react';
import './CSS/BuyerMessages.css';
import { AiOutlineUser, AiOutlineSearch } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaComment, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";
import { MdCheckCircle } from 'react-icons/md';
import useConversations from '../hooks/useConversations';

const BuyerMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, loading, error } = useConversations();
  const navigate = useNavigate();

  const handleChatClick = (conversationId, participant) => {
    sessionStorage.setItem('chatParticipant', JSON.stringify(participant));
    sessionStorage.setItem('conversationId', conversationId);
    navigate('/chat_buyer');
  };

  return (
    <div className="app">
      {/* Header Section */}
      <div className="header4" style={{ background: "#ffffff" }}>
        <Link to="/seller_dashboard">
          <FaArrowLeft className="back-icon5" />
        </Link>
        <h2 className="header-title3">Chat</h2>
      </div>

      <div className='chat-ap'>
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
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {conversations
            .filter(c => c.latest_message?.message?.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(conv => {
              const seller = conv.participants.find(p => !p.is_sender);
              return (
                <div key={conv.id} className="chat-item" onClick={() => handleChatClick(conv.id, seller)}>
                  <img src={seller.avatar_url || "/default-avatar.png"} alt="Seller" />
                  <div className="chat-info">
                    <div className="chat-name">{seller.name}</div>
                    <div className="chat-last-message">
                      {conv.latest_message?.message || "No message yet"}{" "}
                      {conv.latest_message?.is_read && <MdCheckCircle className="tick-mark" />}
                    </div>
                  </div>
                  <div className="chat-meta">
                    <span className="chat-date">{new Date(conv.updated_at).toLocaleDateString()}</span>
                    {conv.unread_messages_count > 0 && (
                      <span className="unread-count">{conv.unread_messages_count}</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Plus Icon */}
      <Link to="/add_items" style={{ textDecoration: "none" }}>
        <div className="plus-icon-wrapper">
          <FiPlus className="plus-icon" />
          <div className="horizontal-lines"></div>
        </div>
      </Link> 

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
         <Link to="/seller_orders">
                <button className="nav-button">
                <FaBoxOpen  className="nav-icon" />
                <span className="nav-label">Buyer Orders</span>
                </button></Link>
        <Link to="/seller_profile_settings" style={{ textDecoration: "none" }}>
          <button className="nav-button2">
            <AiOutlineUser className="nav-icon2" />
            <span className="nav-label2">Profile</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default BuyerMessages;
