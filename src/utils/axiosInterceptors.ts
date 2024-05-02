import axios from 'axios';
import { storageTokenKeys } from '../hooks/useToken';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
/* eslint-disable no-param-reassign */
const instance = axios.create({
  baseURL: 'http://87.205.233.120:8080/api',
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const redirectToLoginPage = () => {
        Cookies.remove(storageTokenKeys.token);
        Cookies.remove(storageTokenKeys.refreshToken);
        if (window.location.pathname.split('/').includes('account')) {
          window.location.href = '/login';
        }
      };

      if (Cookies.get(storageTokenKeys.refreshToken)) {
        try {
          const { data } = await instance.post<{ token: string }>(
            '/auth/refresh',
            {
              refreshToken: Cookies.get(storageTokenKeys.refreshToken),
            },
          );

          const decodedToken = jwtDecode(data.token);

          Cookies.set(storageTokenKeys.token, data.token, {
            expires: decodedToken.exp
              ? new Date(decodedToken.exp * 1000)
              : Date.now(),
          });

          originalRequest.headers.Authorization = `Bearer ${data.token}`;

          return await axios(originalRequest);
        } catch {
          redirectToLoginPage();
        }
      } else {
        redirectToLoginPage();
      }
    }

    return Promise.reject(error);
  },
);

instance.interceptors.request.use(
  config => {
    const token = Cookies.get(storageTokenKeys.token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default instance;
