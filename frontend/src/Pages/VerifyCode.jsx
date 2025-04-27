import React from 'react'
import './CSS/VerifyCode.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


const VerifyCode = () => {
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
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
      </div>
      <p className="didnt-receive">Didn't receive OTP?</p>
      <Link style={{ textDecoration: 'underline', color: '#3b00b3', 
      marginBottom:'30px',  fontWeight: '100', justifyContent:'center',  display: 'flex', width:'100%' }} to=''>Resend Code</Link>
      <Link style={{ width:'100%' }} to='/password-reset'><button type="submit" className="verify-button">Verify</button></Link>
      </div>
    </div>
  );
};

export default VerifyCode;
