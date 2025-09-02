import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './CSS/AdminLogin.css';

import { getAccessToken } from '../utils/token';



const AdminLogin = () => {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded password check
    const ADMIN_PASSWORD = "h@P9ya9pj0yf$l#";

    // inside handleSubmit


    if (password === ADMIN_PASSWORD) {
       // ✅ check if user already has a valid token
      const token = await getAccessToken();

      if (!token) {
        setError("No valid user session found. Please log in as a user first.");
        return;
      }
      alert(`Welcome ${adminName}, Admin login successful!`);
        sessionStorage.setItem("adminName", adminName); // ✅ save to storage
        sessionStorage.setItem("isAdmin", "true"); // flag to know admin mode is active

      navigate("/admin-dashboard");
    } else {
      setError("Invalid admin credentials. Access denied!");
    }
  };

  return (
    <>
      <div className='grp'>            
        <Link to="/modeselect" style={{ textDecoration: "none" }}>
          <div className="back-arrow">
            <FiArrowLeft size={24} />
          </div>
        </Link> 
        <h3 className='hi'>
          Click arrow above to go back if not admin to select user mode
        </h3> 
      </div>

      <div className="admin-login-container">
        <h2 className="admin-login-title">Admin Login</h2>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            className="admin-login-input"
            type="text"
            placeholder="Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
          <input
            className="admin-login-input"
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="admin-login-error">{error}</p>}
          <button className="admin-login-button" type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
