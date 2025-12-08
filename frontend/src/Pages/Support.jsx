import React, { useState, useEffect } from 'react';
import './CSS/Support.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import chat from '../Components/Assets/chat.PNG';
import call from '../Components/Assets/call.PNG';
import whatsap from '../Components/Assets/whatsap.PNG';
import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Support = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Show alert immediately if user clicked email
  useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // User returned to the tab
      const clicked = sessionStorage.getItem("support_email_clicked");
      if (clicked) {
        alert("Thanks for emailing us, We'll offer our support to you soon.");
        sessionStorage.removeItem("support_email_clicked");
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${BASE_URL}/v1/auth/profile`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          const userData = data.data;
          const verifiedOverride =
            sessionStorage.getItem(`email_verified_${userData.username}`) === '1';
          const updatedUser = {
            ...userData,
            email_verify: verifiedOverride ? 1 : userData.email_verify,
          };
          setUser(updatedUser);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading profile...</div>;

  const fullName = user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim();

  const emailBody = encodeURIComponent(
    `Hello, ${fullName}\n\n` +
    `Please type your message below:\n\n` +
    `Indicate if you are a buyer/seller and your brand/fullname,\n` +
    `as well as your email registered on our Sellam Platform.\n\nThank you.`
  );

  const emailURL = `https://mail.google.com/mail/?view=cm&fs=1` +
                   `&to=oluferonmijoshua@gmail.com` +
                   `&su=Support%20Request` +
                   `&body=${emailBody}`;

  const handleEmailClick = () => {
    sessionStorage.setItem("support_email_clicked", "1");
    window.open(emailURL, "_blank");
  };

  const handleWhatsAppClick = () => {
    const whatsappURL = "https://wa.me/message/QUVZA4V4NAWIB1";
    window.open(whatsappURL, "_blank");
  };

  const handleCallClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="cart-container5">

      {/* Header */}
      <div className="header2">
        <Link to="/account_settings">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Support</h2>
      </div>

      <div className="chat-ap">
        <h2 className="welcome-message">Let's Support you</h2>
        <p className="par">
          Contact us via phone, email, or WhatsApp chat if you have a complaint,
          suggestion, or bug to report. We would sincerely appreciate hearing from you.
        </p>

        <div className="support-stat">

          {/* EMAIL Button */}
          <button className="email-btn12" onClick={handleEmailClick}>
            <img src={chat} alt="email support" className="ss" />
          </button>

          {/* WhatsApp Button */}
          <button className="email-btn12" onClick={handleWhatsAppClick}>
            <img src={whatsap} alt="whatsapp support" className="ss" />
          </button>

          {/* CALL Button */}
          <button className="email-btn12" onClick={handleCallClick}>
            <img src={call} alt="call support" className="ss" />
          </button>
        </div>
      </div>

      {/* CALL POPUP */}
      {showPopup && (
        <div className="popup-overlay34" onClick={() => setShowPopup(false)}>
          <div className="popup-box34">
            <h3>Contact Us</h3>
            <p>Contact us directly on our app on:</p>
            <p className="phone-number">+234 813 000 0000</p>

            <button className="close-btn12" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Support;
