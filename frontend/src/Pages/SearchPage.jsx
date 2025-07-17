import React, { useState } from 'react';
import './CSS/SearchPage.css';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiTrash2, FiX } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";
import filter from "../Components/Assets/filter.PNG";
import { getAccessToken } from '../utils/token';
import { useCart } from '../Contexts/CartContext';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SearchPage = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardType, setKeyboardType] = useState("letters");
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();

  const toggleKeyboard = () => setIsKeyboardOpen(!isKeyboardOpen);
  const switchKeyboard = (type) => setKeyboardType(type);
  const handleKeyPress = (char) => setMessage((prev) => prev + char);

  const [results, setResults] = useState([]);


  const sendMessage = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/v1/products/search?query=${message}`, {
        method: "GET",
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const formatted = json.data.map(item => ({
          id: item.id,
          name: item.title,
          image: item.thumbnail?.startsWith('http') ? item.thumbnail : `https://demo.jadesdev.com.ng${item.thumbnail}`,
          price: parseFloat(item.price),
          location: item.location?.name || "Unknown",
          popularity: item.likes ? `${item.likes} Likes` : "New Arrival"
        }));
        setResults(formatted);
      } else {
        setResults([]);
        console.warn("No search results found");
      }
    } catch (err) {
      console.error("❌ Search error:", err);
    }

    setIsKeyboardOpen(false);
  };

  return (
    <div className="recent-searches-container">
      <div className="header2">
        <Link to="/home"><FaArrowLeft className="back-icon2" /></Link>
      </div>

      <div className="chat-ap">
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

        <div className="filter-icon-container">
          <img src={filter} alt="filter icon" className="product-image3" />
        </div>

        {isKeyboardOpen && (
          <div className="keyboard-container">
            {keyboardType === "letters" ? (
              <>
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((char) => (
                  <button key={char} className="key-btn" onClick={() => handleKeyPress(char)}>{char}</button>
                ))}
                <button className="key-btn cancel-btn" onClick={toggleKeyboard}>Cancel</button>
                <button className="key-btn switch-btn" onClick={() => switchKeyboard("numbers")}>123</button>
              </>
            ) : (
              <>
                {Array.from("0123456789!@#$%^&*()").map((char) => (
                  <button key={char} className="key-btn" onClick={() => handleKeyPress(char)}>{char}</button>
                ))}
                <button className="key-btn cancel-btn" onClick={toggleKeyboard}>Cancel</button>
                <button className="key-btn switch-btn" onClick={() => switchKeyboard("letters")}>ABC</button>
              </>
            )}
          </div>
        )}

        <div className="recent-header">
          <p className="recent-title">Recent Searches</p>
          <FiTrash2 className="clear-icon1" />
        </div>

        <div className="recent-searches-tags">
          {["Sunglasses", "Sweater", "Hoodie", "Jacket"].map((tag, index) => (
            <div key={index} className="tag">
              <span className="tag-text">{tag}</span>
              <FiX className="tag-close-icon" />
            </div>
          ))}
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <p style={{ textAlign: "center" }}>No search results yet.</p>
          ) : (
            results.map((result) => (
              <div key={result.id} className="search-card">
                <img src={result.image} alt={result.name} className="search-card-image" />
                <div className="search-card-details">
                  <h4>{result.name}</h4>
                  <p>${result.price}</p>
                  <p className="product-location">{result.location}</p>
                  <p className="product-popularity">{result.popularity}</p>
                  <button
                    className="add-cart-btn"
                    onClick={() => addToCart(result)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
