import { PasswordData, UserData } from '../types/account';
import { client } from '../utils/axiosClient';

export const getUser = () => {
  return client.get<UserData>('/user');
};

export const putUser = (data: Omit<UserData, 'profilePhoto' | 'master'>) => {
  return client.put('/user', data);
};

export const putPassword = (data: PasswordData) => {
  return client.put('/reset-password', data);
};

export const deleteRefreshToken = () => {
  return client.delete('/auth/refreshToken');
};
