import {
  DataLogin, Login, Registration, Token,
} from '../types/login';
import { client } from '../utils/axiosClient';

export const checkUsername = (username: string) => {
  return client.get<boolean>(`/auth/checkUsername?username=${username}`);
};

export const checkUserEmail = (userEmail: string) => {
  return client.get<boolean>(`/auth/checkEmail?email=${userEmail}`);
};

export const loginUser = (data: Login) => {
  return client.post<Token>('/auth/login', data);
};

export const registrateUser = (data: Registration) => {
  return client.post('/auth/registration', data);
};

export const forgotPassword = (email: string) => {
  return client.post(`/forgot-password/${email}`);
};

export const getDeviceToken = () => {
  return client.get<string>('/auth/login/deviceToken');
};

export const authLoginTelegram = (data: DataLogin) => {
  return client.post<Token>('/auth/login/telegram', data);
};
