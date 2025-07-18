import React from 'react';
import './CSS/EscrowInfo.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';
import halfpie from '../Components/Assets/halfpie.PNG';
import { useCart } from '../Contexts/CartContext';

const EscrowInfo = () => {
  const { cartData, cartCount } = useCart();

  const items = cartData?.items || [];

  if (items.length === 0) {
    return (
      <div className="cart-container1">
        <div className="header2">
          <Link to="/checkout"><FaArrowLeft className="back-icon2" /></Link>
          <h2 className="header-title2">Escrow Service</h2>
        </div>
        <p className="cart-message">
          Your cart is empty or missing. Please return to the cart and re-add your items.
        </p>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/cart_items">
            <button className="continue-button">Back to Cart</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container1">
      {/* Header */}
      <div className="header2">
        <Link to="/checkout"><FaArrowLeft className="back-icon2" /></Link>
        <h2 className="header-title2">Escrow Service</h2>
        <Link to="/cart_items">
          <div className="cart-icon-container">
            <AiOutlineShoppingCart className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </div>
        </Link>
      </div>

      {/* Escrow Info */}
      <p className="escrow-info">
        Your payment is held securely by our escrow service until you confirm receipt of the item.
      </p>

      {/* Pie Chart */}
      <div className="custom-pie-chart">
        <img src={halfpie} alt="Half Pie Chart" className="half-pie-image" />
      </div>

      {/* Legend */}
      <ul className="legend">
        <li><span className="legend-color color-purple"></span> Buyer Pays</li>
        <li><span className="legend-color color-cyan"></span> Escrow Holds Payment</li>
        <li><span className="legend-color color-green"></span> Seller Ships</li>
        <li><span className="legend-color color-orange"></span> Buyer Confirms Receipt</li>
        <li><span className="legend-color color-red"></span> Escrow Releases Payment</li>
      </ul>

      {/* Pay Now Button */}
      <Link to="/payment_option" style={{ textDecoration: "none" }}>
        <button type="submit" className="pay-now-button">Pay Now</button>
      </Link>

      {/* Bottom Navigation */}
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

export default EscrowInfo;
