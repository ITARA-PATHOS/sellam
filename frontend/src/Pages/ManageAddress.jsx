import React, { useEffect, useState } from 'react';
import './CSS/ManageAddress.css';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/addresses`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setAddresses(result.data);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setAddresses((prev) => prev.filter(addr => addr.id !== addressId));
      } else {
        alert("Failed to delete address: " + result.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="cart-container6">
      {/* Header */}
      <div className="header2">
        <Link to="/settings">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Manage Delivery Address</h2>
      </div>

      <div className="chat-ap">
        <h2 className="welcome-message">Shop within Location</h2>
        <p className="par">
          Tap to edit/delete addresses for your home, place of business, preferred location, and many more.
        </p>

        {/* Add New Address Card */}
        <div className="order-status-card1">
          <div className="status-content">
            <div className="status-text-group1">
              <FaMapMarkerAlt className="gift-icon2" />
              <p className="rate-title">Add New Address</p>
            </div>
            <Link to="/address_adding">
              <FaArrowRight className="back-icon5" />
            </Link>
          </div>
        </div>

        {/* List of saved addresses */}
        {addresses.map((address, index) => (
          <div className="address-card" key={index}>
            <div className="address-details">
              <div className="address-label">{address.label}</div>
              <div className="address-line">{address.address}</div>
              <div className="address-line">{address.city}, {address.state}</div>
              <div className="address-line">{address.postal_code}, {address.country}</div>
              {address.is_default && <div className="default-tag">Default Address</div>}
            </div>
            <div className="address-actions">
              <button className="icon-btn" onClick={() => navigate(`/address_edit/${address.id}`)}>
                <FaEdit />
              </button>
              <button className="icon-btn1" onClick={() => handleDelete(address.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAddress;
