const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAccessToken = async () => {
  let token = sessionStorage.getItem('access_token');
  const refreshToken = sessionStorage.getItem('refresh_token');

  // Optional: Dev log if refresh token is missing
  if (!refreshToken) {
    console.warn('⚠️ Refresh token is missing from sessionStorage.');
  }

  const isTokenExpired = (token) => {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      return payload.exp * 1000 < Date.now(); // true if expired
    } catch (err) {
      console.warn('⚠️ Invalid or corrupted access token format:', err);
      return true;
    }
  };

  // ✅ Return current token if valid
  if (token && !isTokenExpired(token)) {
    return token;
  }

  // 🔄 Attempt to refresh token
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();

    if (data.success && data.data && data.data.access_token) {
      token = data.data.access_token;
      sessionStorage.setItem('access_token', token);
      return token;
    } else {
      console.error('❌ Token refresh failed:', data.message || data);
      return null;
    }
  } catch (err) {
    console.error('❌ Network error during refresh:', err);
    return null;
  }
};
