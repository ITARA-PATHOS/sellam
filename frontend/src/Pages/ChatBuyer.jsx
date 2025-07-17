import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt, FaCheckDouble } from "react-icons/fa";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { FiSmile, FiMic, FiMoreVertical } from "react-icons/fi";
import pp from '../Components/Assets/pp.jpg';
import './CSS/ChatBuyer.css';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatBuyer = () => {
  const { conversationId } = useParams();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardType, setKeyboardType] = useState("letters");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participant, setParticipant] = useState(null);

  const currentUser = JSON.parse(sessionStorage.getItem('user'));

  const toggleKeyboard = () => setIsKeyboardOpen(!isKeyboardOpen);
  const switchKeyboard = (type) => setKeyboardType(type);
  const handleKeyPress = (char) => setMessage(prev => prev + char);

  const fetchConversation = async () => {
    const token = await getAccessToken();
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
      console.error("❌ Failed to fetch conversation details:", err);
    }
  };

  const fetchMessages = async () => {
    const token = await getAccessToken();
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
        const parsed = data.data.map(m => ({
          text: m.message,
          type: m.sender?.id === currentUser.id ? "sent" : "received",
          created_at: m.created_at
        }));
        setMessages(parsed.reverse());
      }
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  const markAsRead = async () => {
    const token = await getAccessToken();
    try {
      await fetch(`${BASE_URL}/v1/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn("⚠️ Failed to mark as read");
    }
  };

  const deleteConversation = async () => {
    const token = await getAccessToken();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await fetch(`${BASE_URL}/v1/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      alert("Conversation deleted");
      window.location.href = "/buyers_chat";
    } catch (err) {
      console.error("❌ Failed to delete conversation:", err);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const token = await getAccessToken();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("type", "text");

    try {
      const res = await fetch(`${BASE_URL}/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { text: message, type: 'sent' }]);
        setMessage("");
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchConversation();
    fetchMessages();
    markAsRead();
  }, []);

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

  return (
    <div className="chat-app">
      <div className="header2">
        <Link to="/buyers_chat">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">
          {participant?.full_name || participant?.username || "Buyer"}
        </h2>
        <div className="header-icons5">
          <AiOutlinePaperClip className="header-icon5 attachment-icon" />
          <FaCheckDouble className="header-icon5 read-icon" title="Mark as read" onClick={markAsRead} />
          <FaTrashAlt className="header-icon5 delete-icon" title="Delete conversation" onClick={deleteConversation} />
          <FiMoreVertical className="header-icon5 more-icon" />
        </div>
      </div>

      <div className="chat-aps">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === "received" && (
                <img src={pp} alt="Profile" className="seller-image" />
              )}
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

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

        {isKeyboardOpen && <div className="keyboard-container">{renderKeyboard()}</div>}
      </div>
    </div>
  );
};

export default ChatBuyer;
