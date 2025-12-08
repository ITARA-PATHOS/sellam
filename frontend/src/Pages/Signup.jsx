import React, { useState } from 'react';
import './CSS/Signup.css';
import { FaGoogle, FaFacebookF, FaTwitter, FaEyeSlash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ Reusable base URL for all fetch calls

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Signup successful! You can now log in.');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          phone: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        setMessage(data?.message || '❌ Signup failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2 className="welcome-message">Create an account 👋</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              placeholder="Enter first name"
              required
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              placeholder="Enter last name"
              required
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter phone number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Create Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}                
                id="password"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={handleChange}
              />
<button
      type="button"
      className="show-password"
      onClick={() => setShowPassword(!showPassword)}
    >
    {showPassword ? <FaEye /> : <FaEyeSlash />}
    </button>
                </div>
          </div>

          <div className="input-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}                
                id="password_confirmation"
                placeholder="Confirm password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
              />
<button
      type="button"
      className="show-password"
      onClick={() => setShowPassword(!showPassword)}
    >
    {showPassword ? <FaEye /> : <FaEyeSlash />}
    </button>            </div>
          </div>

          <div className="remember-me">
            <div>
              <input type="checkbox" id="agree" />
              <label htmlFor="agree">Agree with Terms and Conditions</label>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {message && (
            <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#280769', textAlign: 'center' }}>
              {message}
            </p>
          )}

          <p className="or">Or</p>

          <div className="social-login">
            <button className="social-button google">
              <FaGoogle className="google-button-icon" />
              <span className="google-button-text">Continue with Google</span>
            </button>
            <button className="social-button facebook">
              <FaFacebookF className="social-icon" />
              <span className="google-button-text">Continue with Facebook</span>
            </button>
            <button className="social-button twitter">
              <FaTwitter className="social-icon" />
              <span className="google-button-text">Continue with Twitter</span>
            </button>
          </div>

          <p className="signup-link">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
