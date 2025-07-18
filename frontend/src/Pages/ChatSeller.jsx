import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { AiOutlinePaperClip, AiOutlineSend, AiOutlineCheck } from "react-icons/ai";
import { FiSmile, FiMic, FiMoreVertical } from "react-icons/fi";
import pp from '../Components/Assets/pp.jpg';
import './CSS/ChatSeller.css';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatSeller = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardType, setKeyboardType] = useState("letters");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participant, setParticipant] = useState(null);

  const conversationId = sessionStorage.getItem('conversationId');
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  const toggleKeyboard = () => {
    setIsKeyboardOpen(!isKeyboardOpen);
  };

  const switchKeyboard = (type) => {
    setKeyboardType(type);
  };

  const handleKeyPress = (char) => {
    setMessage((prev) => prev + char);
  };

 const fetchMessages = useCallback(async () => {
  const token = await getAccessToken();
  if (!token || !conversationId) return;

  try {
    const res = await fetch(`${BASE_URL}/v1/conversations/${conversationId}/messages?order=desc`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.success && data.data) {
      const msgs = data.data.map(m => ({
        text: m.message,
        type: m.sender?.id === currentUser.id ? "sent" : "received",
        created_at: m.created_at
      }));
      setMessages(msgs.reverse()); // oldest first
    }
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
  }
}, [conversationId, currentUser.id]);


  const sendMessage = async () => {
    if (message.trim() === "") return;
    const token = await getAccessToken();
    if (!token || !conversationId) return;

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('type', 'text');

      const res = await fetch(`${BASE_URL}/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  const fetchConversation = useCallback(async () => {
  const token = await getAccessToken();
  if (!token || !conversationId) return;

  try {
    const res = await fetch(`${BASE_URL}/v1/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.success && data.data) {
      const other = data.data.participants.find(p => p.id !== currentUser.id);
      setParticipant(other);
    }
  } catch (err) {
    console.error("❌ Failed to load conversation:", err);
  }
}, [conversationId, currentUser.id]);


 const markConversationAsRead = useCallback(async () => {
  const token = await getAccessToken();
  if (!token || !conversationId) return;

  try {
    await fetch(`${BASE_URL}/v1/conversations/${conversationId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'mark_read' })
    });
  } catch (err) {
    console.error("❌ Failed to mark conversation as read:", err);
  }
}, [conversationId]);


  const deleteConversation = async () => {
    const token = await getAccessToken();
    if (!token || !conversationId) return;

    try {
      await fetch(`${BASE_URL}/v1/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate("/sellers_chat");
    } catch (err) {
      console.error("❌ Failed to delete conversation:", err);
    }
  };

  const renderKeyboard = () => {
    const layout = keyboardType === "letters"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "0123456789!@#$%^&*()";
    return (
      <div className="keyboard">
        {Array.from(layout).map((char) => (
          <button key={char} className="key-btn" onClick={() => handleKeyPress(char)}>
            {char}
          </button>
        ))}
        <button className="key-btn cancel-btn" onClick={toggleKeyboard}>Cancel</button>
        <button className="key-btn switch-btn" onClick={() => switchKeyboard(keyboardType === "letters" ? "numbers" : "letters")}>
          {keyboardType === "letters" ? "123" : "ABC"}
        </button>
      </div>
    );
  };

  useEffect(() => {
  fetchConversation();
  fetchMessages();
  markConversationAsRead();
}, [fetchConversation, fetchMessages, markConversationAsRead]);


  return (
    <div className="chat-app">
      {/* Header */}
      <div className="header2">
        <Link to="/sellers_chat"><FaArrowLeft className="back-icon2" /></Link>
        <h2 className="header-title2">
          {participant?.full_name || participant?.username || "Seller"}
        </h2>
        <div className="header-icons5">
          <AiOutlinePaperClip className="header-icon5 attachment-icon" />
          <AiOutlineCheck className="header-icon5" onClick={markConversationAsRead} title="Mark as Read" />
          <FaTrash className="header-icon5" onClick={deleteConversation} title="Delete Chat" />
          <FiMoreVertical className="header-icon5 more-icon" />
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-aps">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === "received" && <img src={pp} alt="avatar" className="seller-image" />}
              <div className="message-content">
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

export default ChatSeller;
