import axios from 'axios';
import globalRouter from '../globalRouter';
import { showNotification } from '../helpers/notifications';
/* eslint-disable no-param-reassign */
const instance = axios.create({
  baseURL: 'http://178.37.209.186:8080/api',
  timeout: 5000,
});

const redirectToLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  showNotification('error');
  if (globalRouter.navigate) {
    globalRouter.navigate('/login');
  }
};

instance.interceptors.response.use(
  response => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.code === 'ECONNABORTED') {
      showNotification('error');
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data: { token } }
            = await axios.post<{ token: string }>(`${instance.defaults.baseURL}/auth/refresh`, {
              refreshToken,
            });

          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return await axios(originalRequest);
        } catch {
          redirectToLogin();
        }
      } else {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
