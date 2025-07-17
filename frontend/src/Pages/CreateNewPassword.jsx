import React, { useState } from 'react';
import './CSS/CreateNewPassword.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEyeSlash, FaEye } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreateNewPassword = () => {
  const navigate = useNavigate();

  const email = sessionStorage.getItem('resetEmail');
  const code = sessionStorage.getItem('resetCode');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      setError('Session expired. Go back and restart the reset process.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        alert('Password reset successful! Please log in.');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetCode');
        navigate('/login');
      } else {
        setError(data.message || 'Reset failed. Try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="cnp">
      <div className="login-container">
        <div className="back-button">
          <Link to="/login">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>

        <h2 className="welcome-message">Create New Password</h2>

        <form onSubmit={handleResetPassword}>
          {error && <p className="error-msg">{error}</p>}

          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm">Confirm Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Processing...' : 'Confirm'}
          </button>

          <p className="or">Or</p>
          <p className="signup-link">
            Go back to{' '}
            <Link
              style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }}
              to="/login"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
