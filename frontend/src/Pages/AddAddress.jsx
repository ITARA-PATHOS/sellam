import React, { useEffect, useState } from 'react';
import './CSS/AddAddress.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import loca from '../Components/Assets/loca.PNG';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddAddress = () => {
  const { id } = useParams(); // if editing
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false,
  });

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!isEdit) return;
      const token = await getAccessToken();
      try {
        const res = await fetch(`${BASE_URL}/v1/addresses/${id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.success) {
          setFormData(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAccessToken();
    const url = isEdit
      ? `${BASE_URL}/v1/addresses/${id}`
      : `${BASE_URL}/v1/addresses`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/address_management');
        }, 1500);
      } else {
        alert(result.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="cart-container5">
      <div className="header2">
        <Link to="/address_management">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">{isEdit ? 'Edit Address' : 'Add Address'}</h2>
      </div>

      <div className="chat-ap">
        <p className="par">Input Your Preferred Address Down Below</p>

        <form onSubmit={handleSubmit}>
          {["label", "address", "city", "state", "postal_code", "country"].map((field) => (
            <div className="input-group" key={field}>
              <input
                type="text"
                name={field}
                placeholder={`Enter ${field.replace("_", " ")}`}
                required
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="default-address-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
              />
              <span className="checkbox-text">Set as default delivery address</span>
            </label>
          </div>

          <br />
          <button type="submit" className="make-payment-button">
            {isEdit ? 'Update Address' : 'Save Address'}
          </button>

          {showPopup && (
            <div className="popup-overlay" onClick={() => setShowPopup(false)}>
              <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <img src={loca} alt="location" />
                <h3 className="popup-title">Changing Location</h3>
                <p className="popup-message">
                  Please be aware that changing your location will remove any items from your cart.
                </p>
                <button className="popup-done-button1" onClick={() => setShowPopup(false)}>
                  I Understand
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
