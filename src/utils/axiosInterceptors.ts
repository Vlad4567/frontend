import axios from 'axios';
import { store } from '../app/store';
import * as notificationSlice from '../features/notificationSlice';
import globalRouter from '../globalRouter';
/* eslint-disable no-param-reassign */
const instance = axios.create({
  baseURL: 'http://178.37.209.186:8080/api',
  timeout: 5000,
});

const redirectToLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  store.dispatch(notificationSlice.addNotification({
    id: +new Date(),
    title: 'Oops...',
    description: 'Something went wrong...',
  }));
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
      store.dispatch(notificationSlice.addNotification({
        id: +new Date(),
        title: 'Oops something went wrong',
        description: 'Reload the page or try again later',
      }));
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

    return error;
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
  (error) => error,
);

export default instance;
