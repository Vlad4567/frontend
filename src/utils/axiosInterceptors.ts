import axios from 'axios';
import globalRouter from '../globalRouter';
/* eslint-disable no-param-reassign */
const instance = axios.create({
  baseURL: '/api',
});

const redirectToLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  if (globalRouter.navigate) {
    globalRouter.navigate('/login');
  }
};

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const {
            data: { token },
          } = await axios.post<{ token: string }>(
            `${instance.defaults.baseURL}/auth/refresh`,
            {
              refreshToken,
            },
          );

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
  config => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default instance;
