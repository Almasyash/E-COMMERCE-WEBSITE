import axios from 'axios';

// Get or generate guest session ID for guest cart persistence
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('apexcart_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('apexcart_session_id', sessionId);
  }
  return sessionId;
};

// Production API Base URL (configured via environment variable)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: attach bearer token and guest session header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apexcart_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-Session-Id'] = getOrCreateSessionId();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwraps response data and handles token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration & automatic refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('apexcart_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data.data;

          localStorage.setItem('apexcart_access_token', accessToken);
          localStorage.setItem('apexcart_refresh_token', newRefresh);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch {
          localStorage.removeItem('apexcart_access_token');
          localStorage.removeItem('apexcart_refresh_token');
        }
      }
    }

    const message = error.response?.data?.message || error.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;
