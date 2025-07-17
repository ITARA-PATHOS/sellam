import React, { useState } from 'react';
import './CSS/Cart.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';
import { useCart } from '../Contexts/CartContext';

const Cart = () => {
  const {
    cartData,
    cartCount,
    loading,
    clearCart,
    updateCartItemQuantity,
    deleteCartItem
  } = useCart();
  const navigate = useNavigate();

  const items = cartData.items || [];
  const totalAmount = cartData.total || 0;
  const [editingItemId, setEditingItemId] = useState(null);

  return (
    <div className="cart-container">
      {/* Top Header */}
      <div className="header2">
        <Link to="/home">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">
          My Cart → ({cartCount})
        </h2>
        <Link to="/cart_items">
          <div className="cart-icon-container">
            <AiOutlineShoppingCart className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </div>
        </Link>
      </div>

      {/* Cart Items */}
      {loading ? (
        <p className="loading-text">Loading cart...</p>
      ) : items.length === 0 ? (
        <p className="empty-text">
          Your cart is empty, click back arrow to Home to add to Cart...
        </p>
      ) : (
        items.map(item => (
          <div className="cart-item" key={item.id}>
            <img
              src={item.product?.thumbnail || '/placeholder.png'}
              alt={item.product?.title}
              className="product-image1"
            />
            <div className="product-details">
              <div className="product-info">
                <h3 className="product-title2">{item.product?.title}</h3>
                <p className="product-price">₦{item.product?.price}</p>
                <p className="product-condition">
                  <strong>Qty:</strong> {item.quantity}
                  <FiEdit3
                    style={{ marginLeft: 10, cursor: 'pointer', fontSize: 16 }}
                    onClick={() =>
                      setEditingItemId(editingItemId === item.id ? null : item.id)
                    }
                  />
                </p>
                {editingItemId === item.id && (
                  <select
                    className="qty-dropdown"
                    value={item.quantity}
                    onChange={e =>
                      updateCartItemQuantity(item.id, parseInt(e.target.value, 10))
                    }
                  >
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="delete-icon-container">
                <FiTrash2
                  className="delete-icon"
                  style={{ color: "#dc3545", cursor: "pointer" }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this item?')) {
                      deleteCartItem(item.id);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))
      )}

      {/* Total Summary */}
      {!loading && items.length > 0 && (
        <div className="cart-summary">
          <div className="summary-row">
            <span className="summary-label">Total Amount:</span>
            <span className="summary-value">₦{totalAmount.toFixed(2)}</span>
          </div>
          <button
            className="continue-button"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <button
            className="clear-cart-button"
            onClick={async () => {
              if (window.confirm('Are you sure you want to clear the cart?')) {
                await clearCart();
              }
            }}
          >
            Clear Entire Cart
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/home">
          <button className="nav-button">
            <FaHome className="nav-icon" />
            <span className="nav-label">Home</span>
          </button>
        </Link>
        <Link to="/cart_items">
          <button className="nav-button">
            <FaShoppingCart className="nav-icon" />
            <span className="nav-label">Cart</span>
          </button>
        </Link>
        <Link to="/orders_product">
          <button className="nav-button">
            <FaClipboardList className="nav-icon" />
            <span className="nav-label">Orders</span>
          </button>
        </Link>
        <Link to="/settings">
          <button className="nav-button">
            <FaCog className="nav-icon" />
            <span className="nav-label">Settings</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default Cart;
