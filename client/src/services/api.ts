import axios, { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { handleMockRequest } from './mockBackend';

// Get or generate guest session ID for guest carts
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('apexcart_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('apexcart_session_id', sessionId);
  }
  return sessionId;
};

// Check if running on GitHub Pages (or static host / mock mode)
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
const isExplicitMock = import.meta.env.VITE_USE_MOCK === 'true';
const hasExplicitApiUrl = !!import.meta.env.VITE_API_BASE_URL;

// We should use mock directly when on GitHub Pages or when no external API URL is specified
const shouldUseMockDirectly = isGitHubPages || isExplicitMock || !hasExplicitApiUrl;

const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

const customAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  if (shouldUseMockDirectly) {
    const mockRes = await handleMockRequest(config);
    if (mockRes.status >= 400) {
      const error: any = new Error(mockRes.data?.message || 'Request failed');
      error.response = mockRes;
      throw error;
    }
    return {
      data: mockRes.data,
      status: mockRes.status || 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  try {
    return await defaultAdapter(config);
  } catch (err: any) {
    // If backend is unavailable or returns 404/405/Network Error, fallback smoothly to mock
    if (
      !err.response ||
      err.response.status === 404 ||
      err.response.status === 405 ||
      err.message === 'Network Error' ||
      err.code === 'ERR_NETWORK'
    ) {
      console.warn('Backend server returned error, falling back to mock engine for:', config.url);
      const mockRes = await handleMockRequest(config);
      if (mockRes.status >= 400) {
        const error: any = new Error(mockRes.data?.message || 'Request failed');
        error.response = mockRes;
        throw error;
      }
      return {
        data: mockRes.data,
        status: mockRes.status || 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    throw err;
  }
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  adapter: customAdapter,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration & refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('apexcart_refresh_token');

      if (refreshToken && !refreshToken.startsWith('refresh_mock_')) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
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

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
