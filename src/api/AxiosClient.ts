import axios from 'axios';
import { API_TIMEOUT, MAIN_URL } from '../constants/AppConfig';
import { store } from '../store';

const apiService = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiService.interceptors.request.use(
  async (config) => {

    config.baseURL = MAIN_URL + '/mobile';
    const state = store.getState();
    const loginInfo = state.authentication.user;
    // if (loginInfo) {
    //   config.headers['employeeId'] = loginInfo.employeeId;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  response => response,

  error => {
    console.log('API Error:', error?.response);

    return Promise.reject(error);
  },
);

export default apiService;