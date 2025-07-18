import React, { useState } from 'react';
import './CSS/SellerMessages.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaArrowLeft, FaShoppingCart, FaCog } from 'react-icons/fa';
import useConversations from '../hooks/useConversations';

const SellerMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, loading, error } = useConversations();
  const navigate = useNavigate();
  const { id } = useParams();
  void id
  const lastProductId = sessionStorage.getItem('lastProductId');
  console.log("🧭 lastProductId from sessionStorage:", lastProductId);

  const handleChatClick = (conversationId, participant) => {
    sessionStorage.setItem('chatParticipant', JSON.stringify(participant));
    sessionStorage.setItem('conversationId', conversationId);
    navigate('/chat_seller');
  };

  return (
    <div className="app">
      <div className="header4" style={{ background: "#ffffff" }}>
        <Link to={`/product_details/${lastProductId}`}>
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
              const other = conv.participants.find(p => !p.is_sender);
              return (
                <div key={conv.id} className="chat-item" onClick={() => handleChatClick(conv.id, other)}>
                  <img src={other.avatar_url || "/default-avatar.png"} alt="User" />
                  <div className="chat-info">
                    <div className="chat-name">{other.name}</div>
                    <div className="chat-last-message">{conv.latest_message?.message || "No message yet"}</div>
                  </div>
                  <div className="chat-meta">
                    <span className="chat-date">{new Date(conv.updated_at).toLocaleDateString()}</span>
                    {conv.unread_messages_count > 0 && <span className="unread-count">{conv.unread_messages_count}</span>}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button className="nav-button">
            <FaHome className="nav-icon" />
            <span className="nav-label">Home</span>
          </button>
        </Link>
        <Link to="/cart_items" style={{ textDecoration: "none" }}>
          <button className="nav-button">
            <FaShoppingCart className="nav-icon" />
            <span className="nav-label">Cart</span>
          </button>
        </Link>
        <Link to="/orders_product" style={{ textDecoration: "none" }}>
          <button className="nav-button">
            <FaClipboardList className="nav-icon" />
            <span className="nav-label">Orders</span>
          </button>
        </Link>
        <Link to="/settings" style={{ textDecoration: "none" }}>
          <button className="nav-button">
            <FaCog className="nav-icon" />
            <span className="nav-label">Settings</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default SellerMessages;
