import React, { useState, useEffect } from 'react';
import './CSS/NotificationPage.css';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelopeOpen, FaTrash } from "react-icons/fa";
import { getAccessToken } from '../utils/token';
import { IoArrowBack } from 'react-icons/io5';


const BASE_URL = process.env.REACT_APP_API_BASE_URL;



const NotificationPage = () => {

  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
    const [loadingPopup, setLoadingPopup] = useState(false);
      const [unreadCount, setUnreadCount] = useState(0);
const [selectedNotification, setSelectedNotification] = useState(null); // for modal

 // ✅ Fetch All Notifications
  const fetchNotifications = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // ✅ Fetch unread count
  const fetchUnreadCount = async () => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications/unread`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setUnreadCount(json.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  // ✅ Mark as Read
  const markAsRead = async (id) => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (res.ok) {
        console.log(`Notification ${id} marked as read.`);
      } else {
        const errorData = await res.json();
        console.error('Failed to mark as read:', errorData);
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  // ✅ Delete Notification
  const deleteNotification = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this notification?');

  if (!confirmDelete) return; // exit if cancelled

  const token = await getAccessToken();
  try {
    const res = await fetch(`${BASE_URL}/v1/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (res.ok && json.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount(); // update badge if it was unread
    } else {
      console.error('Failed to delete notification:', json.message || json);
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
};

  // ✅ Click for popup and mark as read
  const handleNotificationClick = async (id) => {
    setLoadingPopup(true);
    const token = await getAccessToken();
    try {
      const res = await fetch(`${BASE_URL}/v1/notifications/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setSelectedNotification(json.data);
        await markAsRead(id);
        await fetchNotifications();
        await fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error loading full notification', err);
    }
    setLoadingPopup(false);
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);


  return (
  <div className="notifications-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft size={22} />
      </button>
      <h2>Your Notifications</h2>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
            No notifications yet. Please check back soon.
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-card ${!notif.is_read ? 'unread' : ''}`}
            >
              <div onClick={() => handleNotificationClick(notif.id)}>
                <div className="notification-title">
                  {notif.title}
                  {!notif.is_read && <span className="unread-badge">New</span>}
                </div>
                <div className="notification-description">{notif.message}</div>
              </div>

              <div className="card-actions1">
                <button
                  onClick={() => markAsRead(notif.id)}
                  title="Mark as Read"
                >
                  <FaEnvelopeOpen style={{ color: 'green' }} />
                </button>
                <button
                  onClick={() => deleteNotification(notif.id)}
                  title="Delete"
                >
                  <FaTrash style={{ color: 'red' }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL POPUP */}
      {selectedNotification && (
        <div className="notification-modal">
          <div className="modal-content">
            <h3>{selectedNotification.title}</h3>
            <p>{selectedNotification.message}</p>
            <button onClick={() => setSelectedNotification(null)}>Close</button>
          </div>
        </div>
      )}

      {loadingPopup && (
        <div className="notification-modal">
          <div className="modal-content">
            <p>Loading full notification...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage
