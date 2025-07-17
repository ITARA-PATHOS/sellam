// src/utils/fcm.js
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';
import { getAccessToken } from './token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  return 'web';
}

function getDeviceName() {
  const ua = navigator.userAgent;
  if (ua.includes('Android')) return 'Android Device';
  if (ua.includes('iPhone')) return 'iPhone';
  if (ua.includes('iPad')) return 'iPad';
  return navigator.platform || 'Web Browser';
}

export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BK7pCpL8Z6ZWBe46Z4zg-_G1FhEFOPY7EF9QKVR1vYHKllQMDQiH1tNRsgJUqIRLV2f_Ft8XSK22-bIaYQT5xH0"
    });

    if (!token) {
      console.warn("⚠️ No FCM token available.");
      return null;
    }

    sessionStorage.setItem('fcm_token', token);
    console.log("✅ FCM Token:", token);

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("❌ No access token to send FCM token.");
      return token;
    }

    const payload = {
      fcm_token: token,
      device_type: getDeviceType(),
      device_name: getDeviceName(),
    };

    const res = await fetch(`${BASE_URL}/v1/fcm-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      console.log("✅ FCM token sent to backend.");
    } else {
      console.warn("⚠️ Failed to send FCM token:", data.message);
    }

    return token;
  } catch (error) {
    console.error("❌ FCM error:", error);
    return null;
  }
};
