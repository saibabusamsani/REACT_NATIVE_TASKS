import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_TIMEOUT, BASE_URL, MOBILE_PREFIX, AUTH_KEYWORD } from '../constants/AppConfig';
import { store } from '../store';
import { parseApiError } from './ErrorHandler';

const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiService.interceptors.request.use((config) => {
  // const token = store.getState().authentication.user?.accessToken;
  // if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.url && !config.url.includes(AUTH_KEYWORD)) {
    config.url = `${config.url}${MOBILE_PREFIX}`;
  }

  config.headers.kioskId = 'KSK1';
  return config;
});

let lastToastAt = 0;
const throttledToast = (msg: string) => {
  const now = Date.now();
  if (now - lastToastAt > 3000) {
    Toast.show({ type: 'error', text1: 'Something went wrong', text2: msg });
    lastToastAt = now;
  }
};

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error); // cancelled on purpose — not a real failure
    }

    const parsed = parseApiError(error);

    if (parsed.status === 401) {
      // silent — refresh-token flow handles this elsewhere
    } else if (parsed.status === 403) {
      throttledToast('You don’t have permission to do this.');
    } else if (parsed.status !== null && parsed.status >= 500) {
      throttledToast('Something went wrong on our end. Please try again.');
    } else if (parsed.status === null) {
      throttledToast('Network issue. Check your connection.');
    }
    // 400/404/422 -> left for screen-level handling (inline or ErrorState)

    return Promise.reject(parsed);
  },
);

export default apiService;