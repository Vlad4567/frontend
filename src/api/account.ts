import { PasswordData, UserData } from '../types/account';
import { client } from '../utils/axiosClient';

export const downloadPhoto = (photo: string) => {
  return client.get<ArrayBuffer>(`/photo/download?file=${photo}`, {
    responseType: 'arraybuffer',
  });
};

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

export const sendProfilePhoto = (file: FormData) => {
  return client.post<string>('/profilePhoto', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
