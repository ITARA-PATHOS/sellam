import React, { useState } from 'react';
import './CSS/VerifyCode.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem('resetEmail');
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4 || !email) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        sessionStorage.setItem('resetCode', fullCode);
        navigate('/password-reset');
      } else {
        setError(data.message || 'Invalid code. Try again.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Network error. Try again later.');
    }
  };

  return (
    <div className="vc">
      <div className="login-container">
        <div className="back-button">
          <Link to="/forgotpassword">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>

        <h2 className="welcome-message">Verify Code</h2>
        <p className="par">Please enter the code we just sent to your email</p>

        <div className="code-input-container">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <p className="didnt-receive">Didn't receive OTP?</p>
        <Link
          style={{
            textDecoration: 'underline',
            color: '#3b00b3',
            marginBottom: '30px',
            fontWeight: '100',
            justifyContent: 'center',
            display: 'flex',
            width: '100%',
          }}
          to="/forgotpassword"
        >
          Resend Code
        </Link>

        <button
          type="submit"
          className="verify-button"
          style={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;
