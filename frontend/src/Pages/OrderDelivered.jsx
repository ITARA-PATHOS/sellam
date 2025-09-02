import React, { useEffect, useState } from 'react';
import './CSS/OrderDelivered.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import odel from '../Components/Assets/odel.png';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderDelivered = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [error, setError] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);

  useEffect(() => {
  const fetchDefaultAddress = async () => {
    try {
      const token = await getAccessToken();
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
          setDefaultAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching default address:", err);
    }
  };

  fetchDefaultAddress();

}, []);


 useEffect(() => {
  const fetchOrderDetails = async () => {
    try {
      const token = await getAccessToken();

      const orderRes = await fetch(`${BASE_URL}/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!orderRes.ok) throw new Error('Failed to fetch order');

      const orderData = await orderRes.json();
      setOrder(orderData?.data);
      setOrderItem(orderData?.data?.items?.[0]); // ✅ using item from within the order
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Error loading order details.');
    }
  };

  if (orderId) {
    fetchOrderDetails();
  }
}, [orderId]);

  if (error) {
    return <div className="cart-container4"><p className="error">{error}</p></div>;
  }

  if (!order || !orderItem) {
    return <div className="cart-container4"><p className="loading">Loading order details...</p></div>;
  }

  console.log("🚚 Final Address Displayed:", order.delivery_address || defaultAddress?.address);

  return (
    <div className="cart-container4">
      {/* Header */}
      <div className="header4">
        <Link to="/orders_product">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Order #{order.code || order.id}</h2>
      </div>

      {/* Order Status */}
      <div className="order-status-card">
        <div className="status-content">
          <div className="status-text-group">
        Your order is {orderItem?.buyer_status || orderItem?.status || order.status || 'pending'}
            <p className="status-subtext">Rate product to get 5 points for collect.</p>
          </div>
          <img src={odel} alt="odel" className="status-icon3" />
        </div>
      </div>

      {/* Order Details */}
      <div className="order-details">
        <div className="row">
          <p className="left">Order number</p>
          <p className="right">#{order.code || order.id}</p>
        </div>
        <div className="row">
          <p className="left">Tracking Number</p>
          <p className="right">{order.tracking_number || 'N/A'}</p>
        </div>
        <div className="row">
          <p className="left">Delivery address</p>
<p
  className="right"
  style={{
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    textAlign: 'right',
    lineHeight: '1.5',
  }}
>
  {order?.delivery_address
    ? `${order.delivery_address.address}\n${order.delivery_address.city}, ${order.delivery_address.state}\n${order.delivery_address.postal_code}, ${order.delivery_address.country}`
    : defaultAddress
    ? `${defaultAddress.address}\n${defaultAddress.city}, ${defaultAddress.state}\n${defaultAddress.postal_code}, ${defaultAddress.country}`
    : 'SBI Building, Software Park'}
</p>



        </div>
        <div className="row">
          <p className="left">Product</p>
          <p className="right">{orderItem.product?.title || 'N/A'}</p>
        </div>
        <div className="row">
          <p className="left">Quantity</p>
          <p className="right">{orderItem.quantity}</p>
        </div>
        <div className="row">
          <p className="left">Price</p>
          <p className="right">₦{orderItem.price}</p>
        </div>
        <div className="row">
          <p className="left">Total</p>
          <p className="right">₦{orderItem.total}</p>
        </div>
        <div className="row">
          <p className="left">Seller</p>
          <p className="right">{orderItem.seller?.full_name || '—'}</p>
        </div>
      </div>

      {/* Actions */}
      <Link to={`/product_rating?id=${orderItem.id}&order=${order.id}`}>
  <button className="make-payment-button">Rate</button>
</Link>


      <Link style={{ width: '100%', textDecoration: 'none' }} to="/home">
        <button type="submit" className="continue-shopping-button1">Return Home</button>
      </Link>
    </div>
  );
};

export default OrderDelivered;
