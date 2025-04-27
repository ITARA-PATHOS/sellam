import React from 'react';
import './CSS/NotificationPage.css';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const SellerNotificationPage = () => {

    const notifications = [
        {
          title: "Your order is delivered",
          description: "Rate product to get 5 points for collect.",
        },
        {
          title: "Good morning! Get 20% Voucher",
          description: "Summer sale up to 20% off. Limited voucher. Get now! 🌞",
        },
        {
          title: "Special offer just for you",
          description: "New Autumn Collection 30% off.",
        },
        {
          title: "Holiday sale 50%",
          description: "Summer sale up to 20% off. Limited voucher. Get now! 🌞",
        },
      ];

  return (
     <div className="notifications-container">
      {/* Header */}
            <div className="header4">
            <Link to="/seller_dashboard">
                  <FaArrowLeft className="back-icon2" />
                </Link>
                <h2 className="header-title3">Notification</h2>
            </div>
     
            <div className="chat-ap">

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-card">
            <p className="notification-title">{notification.title}</p>
            <p className="notification-description">
              {notification.description}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default SellerNotificationPage
