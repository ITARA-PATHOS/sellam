import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { FaGoogle, FaFacebookF, FaTwitter, FaEyeSlash, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (
        data.success &&
        data.data &&
        data.data.token &&
        data.data.token.access_token
      ) {
        const accessToken = data.data.token.access_token;
        const refreshToken = data.data.token.refresh_token;
        const user = data.data.user; // user object includes role/type

        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        sessionStorage.setItem('user', JSON.stringify(user));

        setMessage('✅ Login successful! Redirecting...');

        // 🔹 Redirect based on role/type
        setTimeout(() => {
          if (user.role === 'admin' || user.email === 'admin@sellam.com') {
            navigate('/adminmode');
          } else {
            navigate('/modeselect');
          }
        }, 1000);
      } else {
        setMessage(data?.message || '❌ Invalid email or password.');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setMessage('❌ Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2 className="welcome-message">Welcome back 👋</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Enter password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="remember-me">
            <div>
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <Link to="/forgotpassword" style={{ textDecoration: 'underline', color: 'rgb(43, 199, 43)', fontWeight: 'bold' }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#280769', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
