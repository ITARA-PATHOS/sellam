import React, { useState, useEffect } from 'react';
import './CSS/OrderPay.css';
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import ocom1 from '../Components/Assets/ocom1.PNG';

const OrderPay = () => {
  const [orderData, setOrderData] = useState(null);
  const [redirectParams, setRedirectParams] = useState({});
  const location = useLocation();

  useEffect(() => {
    // ✅ Extract possible redirect params from Flutterwave
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const txRef = params.get("tx_ref");
    const transactionId = params.get("transaction_id");

    if (status || txRef || transactionId) {
      const redirectInfo = {
        status,
        txRef,
        transactionId
      };
      setRedirectParams(redirectInfo);
      console.log("🔁 Flutterwave redirect params:", redirectInfo);

      // Optional: Call your backend to verify transaction using txRef or transactionId
    }

    // ✅ Load stored order details
    const storedOrder = sessionStorage.getItem('latest_order');
    if (storedOrder) {
      try {
        const parsed = JSON.parse(storedOrder);
        setOrderData(parsed);
      } catch (e) {
        console.error("❌ Failed to parse latest_order from session:", e);
      }
    }
  }, [location.search]);

  return (
    <div className="cart-container3">
      {/* 🔙 Header */}
      <div className="header2">
        <Link to="/make_payment">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title2">Order Completed</h2>
      </div>

      {/* ✅ Main Content */}
      <div className="content">
        <img src={ocom1} alt="Order Confirmation" className="half-pie-image1" />
        <p className="thank-you-text">
          Thank you for your purchase.<br />
          You can view your order in the 'My Orders' section.
        </p>

        {/* ✅ Order Summary from session */}
        {orderData && (
          <div className="order-summary-box">
            <p><strong>Order Code:</strong> {orderData.code || orderData.id}</p>
            <p><strong>Total:</strong> ₦{parseFloat(orderData.total).toFixed(2)}</p>
            <p><strong>Status:</strong> {orderData.status}</p>
          </div>
        )}

        {/* ✅ Flutterwave redirect details */}
        {redirectParams?.status && (
          <div className="order-summary-box" style={{ marginTop: "20px", background: "#f5f5f5" }}>
            <p><strong>Flutterwave Status:</strong> {redirectParams.status}</p>
            <p><strong>Transaction Ref:</strong> {redirectParams.txRef}</p>
            <p><strong>Transaction ID:</strong> {redirectParams.transactionId}</p>
          </div>
        )}
      </div>

      {/* 👉 Buttons */}
      <Link to="/orders_product" style={{ textDecoration: "none" }}>
        <button type="submit" className="make-payment-button">Continue</button>
      </Link>

      <Link to="/home" style={{ textDecoration: "none", width: '100%' }}>
        <button type="submit" className="continue-shopping-button1">Continue Shopping</button>
      </Link>
    </div>
  );
};

export default OrderPay;
