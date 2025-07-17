import React, { useState, useEffect } from 'react';
import './CSS/PaymentOpt.css';
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaClipboardList, FaCog } from 'react-icons/fa';
import { useCart } from '../Contexts/CartContext';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentOpt = () => {
  const { cartData, cartCount, setCartData } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  const subtotal = cartData?.total || 0;
  const discount = 0;
  const total = subtotal - discount;

  // ✅ Fetch latest cart if empty
  useEffect(() => {
    const fetchCartIfNeeded = async () => {
      if (!cartData?.items || cartData.items.length === 0) {
        const token = await getAccessToken();
        if (!token) return;

        try {
          const res = await fetch(`${BASE_URL}/v1/carts`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const json = await res.json();
          if (json.success && json.data) {
            const updatedCart = {
              items: json.data.items || [],
              total: parseFloat(json.data.total || 0),
            };
            setCartData(updatedCart);
            sessionStorage.setItem('cartData', JSON.stringify(updatedCart));
          }
        } catch (err) {
          console.error("❌ Error fetching cart:", err);
        }
      }
    };

    fetchCartIfNeeded();
  }, [cartData, setCartData]);

  // ✅ Fetch default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const token = await getAccessToken();
      try {
        const res = await fetch(`${BASE_URL}/v1/addresses`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          const defaultAddr = result.data.find(addr => addr.is_default);
          if (defaultAddr) {
            setDefaultAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching default address:", err);
      }
    };

    fetchDefaultAddress();
  }, []);

  const handleProceed = async () => {
    if (!paymentMethod) return alert("Please select a payment method");

    if (paymentMethod === 'paypal') {
      return alert("❌ PayPal is currently not supported. Please use Card or Wallet.");
    }

    const token = await getAccessToken();
    if (!token) return alert("Please log in first");

    if (!defaultAddressId) {
      return alert("No shipping address found. Please add an address first.");
    }

    try {
      const res = await fetch(`${BASE_URL}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod, // "card" or "wallet"
          notes: null,
          redirect_url: window.location.origin + "/payment_order",
          address_id: defaultAddressId,
        }),
      });

      const json = await res.json();

      // ✅ Add the log here
      console.log("Returned order:", json.data);
      if (!json.success) return alert("❌ " + json.message);

      sessionStorage.setItem('latest_order', JSON.stringify(json.data));

      // ✅ Redirect to Flutterwave if payment_link exists
      // ✅ Corrected: support .link (from Flutterwave) too
if (json.data?.link || json.data?.payment_link || json.data?.redirect_url) {
  const redirect =
    json.data.link || json.data.payment_link || json.data.redirect_url;
  window.location.href = redirect;
} else {
  navigate('/payment_order');
}

    } catch (err) {
      console.error("❌ Payment submission failed:", err);
      alert("Something went wrong while submitting payment method");
    }
  };

  return (
    <div className="cart-container">
      <div className="header2">
        <Link to="/escrowinfo"><FaArrowLeft className="back-icon2" /></Link>
        <h2 className="header-title2">Checkout</h2>
        <Link to="/cart_items">
          <div className="cart-icon-container">
            <AiOutlineShoppingCart className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </div>
        </Link>
      </div>

      <div className="cart-summary">
        <div className="sr">
          <div className="summary-row">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Discount:</span>
            <span className="summary-value">₦{discount.toFixed(2)}</span>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">₦{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-overlay">
        <div className="payment-container">
          <h3 className="payment-title">Select Payment Option</h3>

          <div className="payment-option">
            <span className="payment-text">Credit/Debit Card</span>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          {/* Disabled PayPal Option */}
          <div className="payment-option disabled">
            <span className="payment-text">PayPal (Coming Soon)</span>
            <input
              type="radio"
              name="payment"
              value="paypal"
              disabled
            />
          </div>

          <div className="payment-option">
            <span className="payment-text">Wallet</span>
            <input
              type="radio"
              name="payment"
              value="wallet"
              checked={paymentMethod === 'wallet'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          <button type="submit" className="proceed-button" onClick={handleProceed}>
            Proceed to Payment
          </button>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/home">
          <button className="nav-button">
            <FaHome className="nav-icon" /><span className="nav-label">Home</span>
          </button>
        </Link>
        <Link to="/cart_items">
          <button className="nav-button">
            <FaShoppingCart className="nav-icon" /><span className="nav-label">Cart</span>
          </button>
        </Link>
        <Link to="/orders_product">
          <button className="nav-button">
            <FaClipboardList className="nav-icon" /><span className="nav-label">Orders</span>
          </button>
        </Link>
        <Link to="/settings">
          <button className="nav-button">
            <FaCog className="nav-icon" /><span className="nav-label">Settings</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default PaymentOpt;
