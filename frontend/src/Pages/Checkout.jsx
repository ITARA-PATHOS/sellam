import React, { useEffect } from 'react';
import './CSS/Checkout.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useCart } from '../Contexts/CartContext';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Checkout = () => {
  const { cartData, setCartData, cartCount, loading } = useCart();

  const subtotal = cartData?.total || 0;
  const discount = 0;
  const total = subtotal - discount;

  // ✅ Fallback: Refetch cart by token if context is empty
  useEffect(() => {
    const fetchCartIfMissing = async () => {
      if (!cartData.items || cartData.items.length === 0) {
        const token = await getAccessToken();
        if (!token) return;

        try {
          const res = await fetch(`${BASE_URL}/v1/carts`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            // ❌ Removed: credentials: 'include'
          });

          const json = await res.json();
          if (json.success && json.data) {
            const updatedCart = {
              items: json.data.items || [],
              total: parseFloat(json.data.total || 0),
            };
            setCartData(updatedCart);
          }
        } catch (err) {
          console.error("❌ Error fetching cart in Checkout:", err);
        }
      }
    };

    fetchCartIfMissing();
  }, [cartData.items, setCartData]);

  if (loading) {
    return <div className="cart-container"><p>Loading cart...</p></div>;
  }

  if (!cartData.items || cartData.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="header2">
          <Link to="/cart_items"><FaArrowLeft className="back-icon2" /></Link>
          <h2 className="header-title2">Checkout</h2>
        </div>
        <p style={{ textAlign: "center", marginTop: "20px", color: "red", fontWeight: "bold" }}>
          ⚠️ Your cart appears to be empty.<br />
          Please return to the cart and re-add your items.
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
    <div className="cart-container">
      {/* Header */}
      <div className="header2">
        <Link to="/cart_items"><FaArrowLeft className="back-icon2" /></Link>
        <h2 className="header-title2">Checkout</h2>
        <Link to="/cart_items">
          <div className="cart-icon-container">
            <AiOutlineShoppingCart className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </div>
        </Link>
      </div>

      {/* Summary */}
      <div className="cart-summary">
        <div className="summary-row">
          <span className="summary-label">Subtotal:</span>
          <span className="summary-value">₦{parseFloat(subtotal).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Discount:</span>
          <span className="summary-value">₦{discount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">₦{parseFloat(total).toFixed(2)}</span>
        </div>
        <Link to="/escrowinfo">
          <button className="continue-button">Escrow Information</button>
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
