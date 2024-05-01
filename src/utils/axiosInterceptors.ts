import axios from 'axios';
/* eslint-disable no-param-reassign */
const instance = axios.create({
  baseURL: 'http://87.205.233.120:8080/api',
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
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
